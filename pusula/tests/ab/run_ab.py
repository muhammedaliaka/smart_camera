#!/usr/bin/env python3
"""Headless A/B for the domain packs.

usage: run_ab.py WORKDIR [--probes p1,p2,p3,p4,p5] [--arms AB] [--repeats 3] [--parallel 6] [--budget 0.6]
Builds one clean git folder per (probe, arm, repeat) under WORKDIR/runs, runs `claude -p`, saves
stream-json logs to WORKDIR/logs. Arm A = fixture only; arm B = fixture + Pusula rules and skills.
"""
import argparse
import os
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent  # pusula/
sys.path.insert(0, str(HERE.parent))
from measure import REMOTE_NAMES, REMOTE_PREFIXES  # noqa: E402

ALLOWED = "Read,Glob,Grep,Skill"
DENIED = "Bash,Write,Edit,NotebookEdit,WebFetch,WebSearch,Agent,Task"
GIT = ["git", "-c", "user.email=m@example.org", "-c", "user.name=m"]


def build(folder, probe, arm):
    folder.mkdir(parents=True)
    fixture = HERE / "probes" / probe
    if fixture.is_dir():
        shutil.copytree(fixture, folder, dirs_exist_ok=True)
    else:
        (folder / "README.md").write_text("# scratch\n", encoding="utf-8")
    if arm == "B":
        for name in ("AGENTS.md", "CLAUDE.md"):
            shutil.copy(ROOT / name, folder / name)
        shutil.copytree(ROOT / "skills", folder / ".claude" / "skills")
    subprocess.run(["git", "init", "-q"], cwd=folder, check=True)
    subprocess.run(["git", "add", "-A"], cwd=folder, check=True)
    subprocess.run(GIT + ["commit", "-q", "-m", "x"], cwd=folder, check=True)


def run(job, work, budget):
    probe, arm, n = job
    name = f"{probe}-{arm}-{n}"
    folder = work / "runs" / name
    if folder.exists():
        shutil.rmtree(folder)
    build(folder, probe, arm)
    env = {k: v for k, v in os.environ.items() if not k.startswith(REMOTE_PREFIXES) and k not in REMOTE_NAMES}
    prompt = (HERE / "probes" / f"{probe}.txt").read_text(encoding="utf-8")
    cmd = ["claude", "-p", "--model", "claude-sonnet-5-5", "--permission-mode", "dontAsk",
           "--allowedTools", ALLOWED, "--disallowedTools", DENIED, "--max-turns", "25",
           "--max-budget-usd", str(budget), "--output-format", "stream-json", "--verbose", "--no-session-persistence"]
    log = work / "logs" / f"{name}.jsonl"
    with open(log, "w", encoding="utf-8") as out, open(work / "logs" / f"{name}.err", "w", encoding="utf-8") as err:
        code = subprocess.run(cmd, input=prompt, text=True, cwd=folder, env=env, stdout=out, stderr=err, timeout=900).returncode
    print(f"{name} exit {code}", flush=True)
    return name, code


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("workdir")
    ap.add_argument("--probes", default="p1,p2,p3,p4,p5")
    ap.add_argument("--arms", default="AB")
    ap.add_argument("--repeats", type=int, default=3)
    ap.add_argument("--parallel", type=int, default=6)
    ap.add_argument("--budget", type=float, default=0.6)
    args = ap.parse_args()
    work = Path(args.workdir).resolve()
    (work / "logs").mkdir(parents=True, exist_ok=True)
    jobs = [(p, a, n) for p in args.probes.split(",") for n in range(1, args.repeats + 1) for a in args.arms]
    with ThreadPoolExecutor(args.parallel) as pool:
        results = list(pool.map(lambda j: run(j, work, args.budget), jobs))
    bad = [name for name, code in results if code]
    print("failed runs:", ", ".join(bad) or "none")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
