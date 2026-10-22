#!/usr/bin/env python3
"""Pusula mechanical checks. Standard library only; thresholds live in config.json.

Usage: python pusula_check.py [--root DIR] [--staged] [--only size,plan,hardcode,secrets,sast,deps] [--config FILE]
Exit codes: 0 clean, 1 findings, 2 clean but some check did not run.
--staged limits size, plan, hardcode, secrets and sast to staged changes; deps always scans the whole project.
sast and deps need network (rule download, advisory database); offline they report [NOT CHECKED].
"""
import argparse
import fnmatch
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ALL_CHECKS = ["size", "plan", "hardcode", "secrets", "sast", "deps"]
FENCE = re.compile(r"^\s*(`{3,}|~{3,})")


def matches(path, patterns):
    name = os.path.basename(path)
    return any(fnmatch.fnmatch(path, p) or fnmatch.fnmatch(name, p) for p in patterns)


def run(cmd, cwd):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, errors="replace", check=False)


def list_files(root, staged):
    if staged:
        out = run(["git", "diff", "--cached", "--name-only", "--relative", "--diff-filter=ACM"], root)
    else:
        out = run(["git", "ls-files", "-co", "--exclude-standard"], root)
    if out.returncode == 0:
        return [f for f in out.stdout.splitlines() if (root / f).is_file()]
    skip = {".git", "node_modules"}
    return [str(p.relative_to(root)).replace(os.sep, "/") for p in root.rglob("*")
            if p.is_file() and not skip & set(p.relative_to(root).parts)]


def check_size(files, root, cfg):
    limit = cfg["max_file_bytes"]
    return [f"{f}: {(root / f).stat().st_size} bytes, limit {limit} bytes" for f in files
            if not matches(f, cfg["size_ignore"]) and (root / f).stat().st_size > limit]


def check_coverage(f, lines, cfg):
    start = next((i for i, ln in enumerate(lines) if ln.strip().lower() == "## coverage"), None)
    if start is None:
        return [f"{f}: no '## Coverage' section"]
    body = []
    for ln in lines[start + 1:]:
        if ln.startswith("## "):
            break
        body.append(ln)
    found = []
    for name in cfg["plan_coverage_headings"]:
        line = next((ln for ln in body if re.match(rf"^\s*[-*]\s*{re.escape(name)}\s*:", ln, re.IGNORECASE)), None)
        text = line.split(":", 1)[1].strip() if line else ""
        if not text or text.startswith("<"):
            found.append(f"{f}: Coverage line '{name}' is {'missing' if line is None else 'empty'}")
    return found


def check_plan(files, root, cfg):
    found = []
    labels, pattern = cfg["plan_required_labels"], re.compile(cfg["plan_checked_pattern"])
    for f in (f for f in files if matches(f, cfg["plan_globs"])):
        lines = (root / f).read_text(encoding="utf-8", errors="replace").splitlines()
        found += check_coverage(f, lines, cfg)
        fence = None
        for i, line in enumerate(lines):
            m = FENCE.match(line)
            if not m:
                continue
            if fence:
                fence = None if m.group(1)[0] == fence[0] and len(m.group(1)) >= len(fence) else fence
                continue
            fence = m.group(1)
            above = [re.sub(r"^[\s>*_-]+", "", ln).replace("*", "") for ln in lines[max(0, i - cfg["plan_label_lookback_lines"]):i]]
            for label in labels:
                hit = next((ln for ln in above if ln.startswith(label)), None)
                if hit is None:
                    found.append(f"{f}:{i + 1}: code block without '{label}' above it")
                elif label.startswith("Checked") and not pattern.search(hit[len(label):]):
                    found.append(f"{f}:{i + 1}: 'Checked:' needs a URL, 'ran in this session' or 'UNVERIFIED'")
    return found


def tool_path(cfg, key):
    return shutil.which(cfg["tools"][key]["exe"])


class Unavailable(Exception):
    """A check could not run for a reason other than a missing tool."""


def semgrep_scan(files, root, cfg, staged, configs):
    exe = tool_path(cfg, "semgrep")
    if not exe:
        return None
    targets = files if staged else ["."]
    if not targets:
        return []
    cmd = [exe, "scan", "--metrics=off", "--disable-version-check", "--quiet", "--json"]
    for conf in configs:
        cmd += ["--config", conf]
    proc = run(cmd + targets, root)
    data = json.loads(proc.stdout) if proc.stdout.strip().startswith("{") else {}
    if proc.returncode != 0 or not data:
        why = next((e["message"] for e in data.get("errors", [])), proc.stderr.strip())
        raise Unavailable(f"semgrep did not run (exit {proc.returncode}): {why[:160]}")
    return [f"{r['path']}:{r['start']['line']}: {r['extra']['message'].splitlines()[0][:140]} [{r['check_id'].split('.')[-1]}]"
            for r in data.get("results", []) if r["extra"]["severity"] in cfg["fail_severities"]]


def check_hardcode(files, root, cfg, staged):
    return semgrep_scan(files, root, cfg, staged, [str(HERE / cfg["semgrep_rules"])])


def check_sast(files, root, cfg, staged):
    return semgrep_scan(files, root, cfg, staged, cfg["semgrep_rulesets"])


def check_secrets(root, cfg, staged):
    exe = tool_path(cfg, "gitleaks")
    if not exe:
        return None
    mode = ["git", "--staged"] if staged else ["dir", "."]
    cmd = [exe] + mode + ["--no-banner", "--redact", "--report-format", "json", "--report-path", "-"]
    proc = run(cmd, root)
    text = proc.stdout[proc.stdout.find("["):] if "[" in proc.stdout else "[]"
    return [f"{r['File']}:{r['StartLine']}: possible secret [{r['RuleID']}]" for r in json.loads(text)]


def check_deps(root, cfg):
    exe = tool_path(cfg, "osv")
    if not exe:
        return None
    proc = run([exe, "scan", "source", "-r", "--format", "json", "."], root)
    if proc.returncode not in (0, 1) or not proc.stdout.strip().startswith("{"):
        return [] if proc.returncode == 128 else [f"osv-scanner failed (exit {proc.returncode}): {proc.stderr.strip()[-200:]}"]
    found = []
    for res in json.loads(proc.stdout).get("results", []):
        for pkg in res.get("packages", []):
            ids = ", ".join(v["id"] for v in pkg.get("vulnerabilities", []))
            if ids:
                found.append(f"{os.path.relpath(res['source']['path'], root)}: {pkg['package']['name']} {pkg['package']['version']}: {ids}")
    return found


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    ap.add_argument("--staged", action="store_true")
    ap.add_argument("--only", default=",".join(ALL_CHECKS))
    ap.add_argument("--config", default=str(HERE / "config.json"))
    args = ap.parse_args()
    root = Path(args.root).resolve()
    cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    chosen = [c for c in args.only.split(",") if c in ALL_CHECKS]
    files = list_files(root, args.staged)
    results = {
        "size": lambda: check_size(files, root, cfg),
        "plan": lambda: check_plan(files, root, cfg),
        "hardcode": lambda: check_hardcode(files, root, cfg, args.staged),
        "secrets": lambda: check_secrets(root, cfg, args.staged),
        "sast": lambda: check_sast(files, root, cfg, args.staged),
        "deps": lambda: check_deps(root, cfg),
    }
    tool_for = {"hardcode": "semgrep", "secrets": "gitleaks", "sast": "semgrep", "deps": "osv"}
    total, skipped = 0, 0
    print(f"PUSULA CHECKS root={root} files={len(files)} staged={args.staged}")
    for name in chosen:
        try:
            found = results[name]()
        except Unavailable as why:
            skipped += 1
            print(f"[NOT CHECKED] {name}: {why}")
            continue
        if found is None:
            skipped += 1
            print(f"[NOT CHECKED] {name}: {tool_for[name]} not installed ({cfg['tools'][tool_for[name]]['install']})")
        elif found:
            total += len(found)
            print(f"[FAIL] {name}: {len(found)}")
            shown = found[:cfg["max_findings_per_check"]]
            print("\n".join(f"  - {line}" for line in shown))
            if len(found) > len(shown):
                print(f"  ... {len(found) - len(shown)} more")
        else:
            print(f"[ok] {name}")
    print(f"Result: {'FAIL' if total else 'CLEAN' if not skipped else 'INCOMPLETE'} ({total} findings, {skipped} not checked)")
    sys.exit(1 if total else 2 if skipped else 0)


if __name__ == "__main__":
    main()
