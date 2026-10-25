#!/usr/bin/env python3
"""Pusula measurements for tests T6 and T7. Standard library only; targets live in targets.json.

  python tests/measure.py real [--root DIR]      real start-up load: headless A/B against a bare project (T7)
  python tests/measure.py load [--root DIR]      start-up load estimate, no model call (T7)
  python tests/measure.py sentences FILE         sentence length of a saved reply (T6)
`load` is an estimate (characters / chars_per_token) and runs about 1.5 times low; `real` asks the model once per variant.
Exit codes: 0 within targets, 1 over a target.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
TARGETS = json.loads((HERE / "targets.json").read_text(encoding="utf-8"))
MAX_BYTES = json.loads((HERE.parent / "checks" / "config.json").read_text(encoding="utf-8"))["max_file_bytes"]
FRONT = re.compile(r"\A---\n(.*?)\n---\n(.*)\Z", re.DOTALL)


def tokens(chars):
    return round(chars / TARGETS["chars_per_token"])


def split_skill(path):
    match = FRONT.match(path.read_text(encoding="utf-8"))
    head, body = (match.group(1), match.group(2)) if match else ("", path.read_text(encoding="utf-8"))
    fields = dict(ln.split(": ", 1) for ln in head.splitlines() if ": " in ln)
    return fields.get("name", path.parent.name), fields.get("description", ""), body


def load_rows(root):
    core = sum(len((root / n).read_text(encoding="utf-8")) for n in ("AGENTS.md", "CLAUDE.md") if (root / n).is_file())
    skills = [split_skill(p) for p in sorted((root / "skills").glob("*/SKILL.md"))]
    listing = sum(len(name) + len(desc) for name, desc, _ in skills)
    biggest = max(skills, key=lambda s: len(s[2]))
    return [
        ("core (AGENTS.md + CLAUDE.md)", tokens(core), TARGETS["core_tokens_max"]),
        (f"skill listing ({len(skills)} names + descriptions)", tokens(listing), None),
        ("start load (core + listing)", tokens(core + listing), TARGETS["start_tokens_max"]),
        (f"largest skill body ({biggest[0]})", tokens(len(biggest[2])), TARGETS["skill_body_tokens_max"]),
    ]


def oversize_files(root):
    return [f"{p.relative_to(root)}: {p.stat().st_size} bytes" for p in root.rglob("*")
            if p.is_file() and not {".git", "__pycache__"} & set(p.parts) and p.stat().st_size > MAX_BYTES]


def load(root):
    over = oversize_files(root)
    print(f"{'measure':50} {'est. tokens':>11} {'target':>7}")
    failed = bool(over)
    for label, value, limit in load_rows(root):
        flag = " OVER" if limit and value > limit else ""
        failed |= bool(flag)
        print(f"{label:50} {value:>11} {limit or '':>7}{flag}")
    print(f"files over {MAX_BYTES} bytes: {', '.join(over) or 'none'}")
    return failed


REMOTE_PREFIXES = ("CCR_", "CLAUDE_CODE_REMOTE", "CLAUDE_CODE_CCR", "CLAUDE_CODE_USE_CCR",
                   "CLAUDE_CODE_POST_FOR_SESSION", "CLAUDE_SESSION_INGRESS")
REMOTE_NAMES = ("CLAUDE_CODE_SESSION_ID", "CLAUDE_CODE_CHILD_SESSION")


def first_request_tokens(project):
    """Input tokens of one headless turn in `project`. Remote-session variables are dropped so the run stays separate."""
    env = {k: v for k, v in os.environ.items() if not k.startswith(REMOTE_PREFIXES) and k not in REMOTE_NAMES}
    out = subprocess.run(["claude", "-p", "Reply with one word: ok", "--output-format", "json", "--max-turns", "1",
                          "--no-session-persistence"], cwd=project, env=env, capture_output=True, text=True, check=True)
    usage = json.loads(out.stdout)["usage"]
    return sum(usage[k] for k in ("input_tokens", "cache_creation_input_tokens", "cache_read_input_tokens"))


def real(root):
    if not shutil.which("claude"):
        print("claude CLI not found; use `load` for an estimate")
        return True
    with tempfile.TemporaryDirectory() as tmp:
        bare, pusula = Path(tmp, "bare"), Path(tmp, "pusula")
        for project in (bare, pusula):
            project.mkdir()
            (project / "README.md").write_text("# scratch\n", encoding="utf-8")
        for name in ("AGENTS.md", "CLAUDE.md"):
            shutil.copy(root / name, pusula / name)
        shutil.copytree(root / "skills", pusula / ".claude" / "skills")
        for project in (bare, pusula):  # a clean git tree: uncommitted changes would add tokens of their own
            subprocess.run(["git", "init", "-q"], cwd=project, check=True)
            subprocess.run(["git", "add", "-A"], cwd=project, check=True)
            subprocess.run(["git", "-c", "user.email=m@example.org", "-c", "user.name=m", "commit", "-q", "-m", "x"], cwd=project, check=True)
        base, with_pusula = first_request_tokens(bare), first_request_tokens(pusula)
    delta, limit = with_pusula - base, TARGETS["real_start_tokens_max"]
    print(f"bare project: {base} tokens; with Pusula: {with_pusula} tokens; Pusula adds {delta} (target {limit}){' OVER' if delta > limit else ''}")
    return delta > limit


def sentences(path):
    text = re.sub(r"`{3,}.*?`{3,}", " ", Path(path).read_text(encoding="utf-8"), flags=re.DOTALL)
    text = re.sub(r"`[^`]*`|[*_#>|]|\[([^\]]*)\]\([^)]*\)", lambda m: m.group(1) or " ", text)
    counts = [len(re.findall(r"\w+", s)) for s in re.split(r"(?<=[.!?…:])\s+|\n+", text)]
    counts = [c for c in counts if c]
    if not counts:
        print("no sentences found")
        return True
    limit, avg = TARGETS["sentence_words_max"], sum(counts) / len(counts)
    print(f"sentences={len(counts)} average={avg:.1f} longest={max(counts)} over_{limit}={sum(c > limit for c in counts)}")
    return avg > limit


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("load").add_argument("--root", default=str(HERE.parent))
    sub.add_parser("real").add_argument("--root", default=str(HERE.parent))
    sub.add_parser("sentences").add_argument("file")
    args = ap.parse_args()
    if args.cmd == "sentences":
        failed = sentences(args.file)
    else:
        failed = {"load": load, "real": real}[args.cmd](Path(args.root).resolve())
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
