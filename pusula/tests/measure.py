#!/usr/bin/env python3
"""Pusula measurements for tests T6 and T7. Standard library only; targets live in targets.json.

  python tests/measure.py load [--root DIR]      start-up load estimate (T7)
  python tests/measure.py sentences FILE         sentence length of a saved reply (T6)
Token figures are estimates (characters / chars_per_token). Read /context in the host for the real number.
Exit codes: 0 within targets, 1 over a target.
"""
import argparse
import json
import re
import sys
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


def load(root):
    core = sum(len((root / n).read_text(encoding="utf-8")) for n in ("AGENTS.md", "CLAUDE.md") if (root / n).is_file())
    skills = [split_skill(p) for p in sorted((root / "skills").glob("*/SKILL.md"))]
    listing = sum(len(name) + len(desc) for name, desc, _ in skills)
    biggest = max(skills, key=lambda s: len(s[2]))
    rows = [
        ("core (AGENTS.md + CLAUDE.md)", tokens(core), TARGETS["core_tokens_max"]),
        (f"skill listing ({len(skills)} names + descriptions)", tokens(listing), None),
        ("start load (core + listing)", tokens(core + listing), TARGETS["start_tokens_max"]),
        (f"largest skill body ({biggest[0]})", tokens(len(biggest[2])), TARGETS["skill_body_tokens_max"]),
    ]
    over = [f"{p.relative_to(root)}: {p.stat().st_size} bytes" for p in root.rglob("*")
            if p.is_file() and ".git" not in p.parts and p.stat().st_size > MAX_BYTES]
    failed = bool(over)
    print(f"{'measure':50} {'est. tokens':>11} {'target':>7}")
    for label, value, limit in rows:
        flag = " OVER" if limit and value > limit else ""
        failed |= bool(flag)
        print(f"{label:50} {value:>11} {limit or '':>7}{flag}")
    print(f"files over {MAX_BYTES} bytes: {', '.join(over) or 'none'}")
    return failed


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
    sub.add_parser("sentences").add_argument("file")
    args = ap.parse_args()
    failed = load(Path(args.root).resolve()) if args.cmd == "load" else sentences(args.file)
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
