#!/usr/bin/env python3
"""Pusula after-compaction reminder, a SessionStart hook with matcher `compact`. Standard library only.

Compaction summarizes the conversation, so a "don't" the user said can fade. This prints the permission and
prohibition log and the newest progress note from disk, capped by config.json, and nothing when there are none.
"""
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
CFG = json.loads((HERE / "config.json").read_text(encoding="utf-8"))


def newest_progress(pusula):
    notes = sorted(pusula.glob("*/progress.md"), key=lambda p: p.stat().st_mtime, reverse=True)
    return notes[:1]


def main():
    root = Path(os.environ.get("CLAUDE_PROJECT_DIR") or ".").resolve()
    pusula = root / ".pusula"
    files = [pusula / "permissions.md", *newest_progress(pusula)]
    budget = CFG["after_compact_max_bytes"]
    for path in filter(Path.is_file, files):
        text = path.read_text(encoding="utf-8", errors="replace")[:budget]
        sys.stdout.write(f"[{path.relative_to(root).as_posix()} after compaction]\n{text.rstrip()}\n\n")
        budget -= len(text)
        if budget <= 0:
            break


if __name__ == "__main__":
    main()
