#!/usr/bin/env python3
"""Pusula lock guard, a PreToolUse hook for Bash and Grep. Standard library only.

Locked paths are the `Read(...)` entries under permissions.ask in .claude/settings.json (and settings.local.json).
Claude Code already stops its Read tool on them. This hook covers commands that name a locked path
(grep, rg, awk, python ...) by asking the user first, so one list serves both. It cannot see a command that
reads a path without naming it (`grep -r x .`); the sandbox is the only complete answer to that.
"""
import fnmatch
import json
import os
import re
import sys
from pathlib import Path

RULE = re.compile(r"^Read\((.+)\)$")
TOKEN_SPLIT = re.compile(r"[\s;|&<>()'\"`=]+")
SETTINGS = ("settings.json", "settings.local.json")


def locked_patterns(root):
    found = []
    for name in SETTINGS:
        path = root / ".claude" / name
        if path.is_file():
            asks = json.loads(path.read_text(encoding="utf-8")).get("permissions", {}).get("ask", [])
            found += [m[1] for m in map(RULE.match, asks) if m]
    return found


def is_locked(rel, pattern):
    tail = pattern.removeprefix("**/")
    return any(fnmatch.fnmatch(rel, p) or fnmatch.fnmatch(rel, "*/" + p) for p in (pattern, tail))


def relative(token, root):
    token = token.replace("\\", "/")
    path = Path(token)
    if path.is_absolute():
        try:
            return path.relative_to(root).as_posix()
        except ValueError:
            return token
    return token.removeprefix("./")


def candidates(event):
    tool_input = event.get("tool_input", {})
    if event.get("tool_name") == "Bash":
        return TOKEN_SPLIT.split(tool_input.get("command", ""))
    return [tool_input.get("path", "")]


def first_lock(event, root):
    patterns = locked_patterns(root)
    for token in filter(None, candidates(event)):
        rel = relative(token, root)
        for pattern in patterns:
            if is_locked(rel, pattern):
                return rel
    return None


def main():
    event = json.load(sys.stdin)
    root = Path(os.environ.get("CLAUDE_PROJECT_DIR") or event.get("cwd") or ".").resolve()
    hit = first_lock(event, root)
    if hit:
        reason = f"Locked by Pusula: {hit}. It floods the context. Ask the user before reading it, and say why you need it."
        print(json.dumps({"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "ask",
                                                 "permissionDecisionReason": reason}}))


if __name__ == "__main__":
    main()
