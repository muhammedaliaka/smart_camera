#!/usr/bin/env python3
"""Pusula mechanical checks. Standard library only; thresholds live in config.json.

Usage: python pusula_check.py [--root DIR] [--staged | --all] [--only size,plan,hardcode,secrets,sast,complexity,architecture,deps,shield] [--config FILE]
Exit codes: 0 clean, 1 findings, 2 clean but some check did not run.
Default: size, plan, hardcode and complexity look only at files changed since the last commit (new files included), so old code stays quiet;
secrets, sast, architecture and deps always look at the whole project, because a hole in old code is still a hole.
--staged limits size, plan, hardcode, secrets, sast and complexity to staged changes. --all makes every check look at the whole project.
sast and deps need network (rule download, advisory database); offline they report [NOT CHECKED].
shield is opt-in (name it in --only): it scans release_dir from .pusula/shield.config.json for files that hand over the source for free.
"""
import argparse
import fnmatch
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
ALL_CHECKS = ["size", "plan", "hardcode", "secrets", "sast", "complexity", "architecture", "deps"]
OPT_IN = ["shield"]
FENCE = re.compile(r"^\s*(`{3,}|~{3,})")
TOOL_FOR = {"hardcode": "semgrep", "secrets": "gitleaks", "sast": "semgrep", "complexity": "lizard", "deps": "osv"}


def matches(path, patterns):
    name = os.path.basename(path)
    return any(fnmatch.fnmatch(path, p) or fnmatch.fnmatch(name, p) for p in patterns)


def run(cmd, cwd):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, errors="replace", check=False)


GIT_LISTS = {
    "staged": [["git", "diff", "--cached", "--name-only", "--relative", "--diff-filter=ACM"]],
    "changed": [["git", "diff", "HEAD", "--name-only", "--relative", "--diff-filter=ACMR"],
                ["git", "ls-files", "-o", "--exclude-standard"]],
    "all": [["git", "ls-files", "-co", "--exclude-standard"]],
}


def walk_files(root):
    skip = {".git", "node_modules"}
    return [str(p.relative_to(root)).replace(os.sep, "/") for p in root.rglob("*")
            if p.is_file() and not skip & set(p.relative_to(root).parts)]


def list_files(root, mode):
    outs = [run(cmd, root) for cmd in GIT_LISTS[mode]]
    if any(o.returncode for o in outs):
        return list_files(root, "all") if mode == "changed" else walk_files(root)
    names = sorted({f for o in outs for f in o.stdout.splitlines()})
    return [f for f in names if (root / f).is_file()]


def check_size(files, root, cfg):
    limit = cfg["max_file_bytes"]
    return [f"{f}: {(root / f).stat().st_size} bytes, limit {limit} bytes" for f in files
            if not matches(f, cfg["size_ignore"]) and (root / f).stat().st_size > limit]


def section(lines, title):
    """Lines under '## <title>' up to the next '## ' heading, or None when the heading is missing."""
    start = next((i for i, ln in enumerate(lines) if ln.strip().lower() == f"## {title}"), None)
    if start is None:
        return None
    end = next((i for i in range(start + 1, len(lines)) if lines[i].startswith("## ")), len(lines))
    return lines[start + 1:end]


def coverage_problem(body, name):
    line = next((ln for ln in body if re.match(rf"^\s*[-*]\s*{re.escape(name)}\s*:", ln, re.IGNORECASE)), None)
    text = line.split(":", 1)[1].strip() if line else ""
    if text and not text.startswith("<"):
        return None
    return "missing" if line is None else "empty"


def check_coverage(f, lines, cfg):
    body = section(lines, "coverage")
    if body is None:
        return [f"{f}: no '## Coverage' section"]
    problems = ((name, coverage_problem(body, name)) for name in cfg["plan_coverage_headings"])
    return [f"{f}: Coverage line '{name}' is {why}" for name, why in problems if why]


def fence_openings(lines):
    """Index of each line that opens a fenced code block; a longer or different fence inside one does not open another."""
    fence = None
    for i, line in enumerate(lines):
        m = FENCE.match(line)
        if not m:
            continue
        if fence is None:
            fence = m.group(1)
            yield i
        elif m.group(1)[0] == fence[0] and len(m.group(1)) >= len(fence):
            fence = None


def label_problems(f, lines, i, cfg):
    pattern = re.compile(cfg["plan_checked_pattern"])
    above = [re.sub(r"^[\s>*_-]+", "", ln).replace("*", "") for ln in lines[max(0, i - cfg["plan_label_lookback_lines"]):i]]
    found = []
    for label in cfg["plan_required_labels"]:
        hit = next((ln for ln in above if ln.startswith(label)), None)
        if hit is None:
            found.append(f"{f}:{i + 1}: code block without '{label}' above it")
        elif label.startswith("Checked") and not pattern.search(hit[len(label):]):
            found.append(f"{f}:{i + 1}: 'Checked:' needs a URL, 'ran in this session' or 'UNVERIFIED'")
    return found


def check_plan(files, root, cfg):
    found = []
    for f in (f for f in files if matches(f, cfg["plan_globs"])):
        lines = (root / f).read_text(encoding="utf-8", errors="replace").splitlines()
        found += check_coverage(f, lines, cfg)
        for i in fence_openings(lines):
            found += label_problems(f, lines, i, cfg)
    return found


def tool_path(cfg, key):
    return shutil.which(cfg["tools"][key]["exe"])


class Unavailable(Exception):
    """A check could not run for a reason other than a missing tool."""


def semgrep_findings(proc, cfg):
    data = json.loads(proc.stdout) if proc.stdout.strip().startswith("{") else {}
    if proc.returncode != 0 or not data:
        why = next((e["message"] for e in data.get("errors", [])), proc.stderr.strip())
        raise Unavailable(f"semgrep did not run (exit {proc.returncode}): {why[:160]}")
    return [f"{r['path']}:{r['start']['line']}: {r['extra']['message'].splitlines()[0][:140]} [{r['check_id'].split('.')[-1]}]"
            for r in data.get("results", []) if r["extra"]["severity"] in cfg["fail_severities"]]


def semgrep_scan(files, root, cfg, scoped, configs):
    exe = tool_path(cfg, "semgrep")
    if not exe:
        return None
    targets = files if scoped else ["."]
    if not targets:
        return []
    cmd = [exe, "scan", "--metrics=off", "--disable-version-check", "--quiet", "--json"]
    cmd += [a for conf in configs for a in ("--config", conf)]
    return semgrep_findings(run(cmd + targets, root), cfg)


def check_hardcode(files, root, cfg, scoped):
    return semgrep_scan(files, root, cfg, scoped, [str(HERE / cfg["semgrep_rules"])])


def check_sast(files, root, cfg, staged):
    return semgrep_scan(files, root, cfg, staged, cfg["semgrep_rulesets"])


def gitleaks_config(root, tmp):
    """Default rules plus an allowlist of everything git ignores, because gitleaks `dir` scans build output too."""
    out = run(["git", "ls-files", "-oi", "--exclude-standard", "--directory"], root)
    paths = [f"^{re.escape(p)}" for p in out.stdout.splitlines()] if out.returncode == 0 else []
    if not paths:
        return []
    conf = Path(tmp) / "gitleaks.toml"
    body = ", ".join(f"'''{p}'''" for p in paths)
    conf.write_text(f"[extend]\nuseDefault = true\n[[allowlists]]\npaths = [{body}]\n")
    return ["--config", str(conf)]


def check_secrets(root, cfg, staged):
    exe = tool_path(cfg, "gitleaks")
    if not exe:
        return None
    mode = ["git", "--staged"] if staged else ["dir", "."]
    with tempfile.TemporaryDirectory() as tmp:
        extra = [] if staged else gitleaks_config(root, tmp)
        cmd = [exe] + mode + extra + ["--no-banner", "--redact", "--report-format", "json", "--report-path", "-"]
        proc = run(cmd, root)
    if proc.returncode not in (0, 1):
        raise Unavailable(f"gitleaks did not run (exit {proc.returncode}): {proc.stderr.strip()[-160:]}")
    text = proc.stdout[proc.stdout.find("["):] if "[" in proc.stdout else "[]"
    return [f"{r['File']}:{r['StartLine']}: possible secret [{r['RuleID']}]" for r in json.loads(text)]


LIZARD_WARNING = re.compile(r"^(.+?):(\d+): warning: (.+?) has \d+ NLOC, (\d+) CCN")


def check_complexity(files, root, cfg, scoped):
    exe = tool_path(cfg, "lizard")
    if not exe:
        return None
    ignore, limit = cfg["complexity_ignore"], cfg["complexity_max"]
    targets = [f for f in files if not matches(f, ignore)] if scoped else ["."]
    if not targets:
        return []
    proc = run([exe, "-C", str(limit), "-w", "-i", "-1"] + [a for p in ignore for a in ("-x", p)] + targets, root)
    if proc.returncode != 0:
        raise Unavailable(f"lizard did not run (exit {proc.returncode}): {proc.stderr.strip()[-160:]}")
    hits = filter(None, map(LIZARD_WARNING.match, proc.stdout.splitlines()))
    return [f"{m[1]}:{m[2]}: {m[3]} has complexity {m[4]}, limit {limit}" for m in hits]


def module_cells(rows):
    """First column of each real table row, backticks stripped; header and separator rows are skipped."""
    for ln in rows:
        cell = ln.split("|")[1].strip().strip("`") if ln.lstrip().startswith("|") else ""
        if cell and cell.lower() != "path" and not set(cell) <= set("-: "):
            yield cell


def module_problem(root, cell):
    if cell.startswith("<"):
        return "is still a placeholder"
    if Path(cell).is_absolute():
        return "must be a relative path"
    return None if (root / cell).exists() or any(root.glob(cell)) else "does not exist"


def check_architecture(root, cfg):
    name = cfg["architecture_file"]
    if not (root / name).is_file():
        return []
    rows = section((root / name).read_text(encoding="utf-8", errors="replace").splitlines(), "modules")
    if rows is None:
        return [f"{name}: no '## Modules' section"]
    problems = ((cell, module_problem(root, cell)) for cell in module_cells(rows))
    return [f"{name}: module path '{cell}' {why}" for cell, why in problems if why]


def osv_packages(root, cfg):
    exe = tool_path(cfg, "osv")
    if not exe:
        return None
    proc = run([exe, "scan", "source", "-r", "--format", "json", "."], root)
    if proc.returncode == 128:
        return []
    if proc.returncode not in (0, 1) or not proc.stdout.strip().startswith("{"):
        raise Unavailable(f"osv-scanner did not run (exit {proc.returncode}): {proc.stderr.strip()[-160:]}")
    return [(os.path.relpath(res["source"]["path"], root), pkg)
            for res in json.loads(proc.stdout).get("results", []) for pkg in res.get("packages", [])]


def check_deps(root, cfg):
    packages = osv_packages(root, cfg)
    if packages is None:
        return None
    return [f"{src}: {pkg['package']['name']} {pkg['package']['version']}: {', '.join(v['id'] for v in pkg['vulnerabilities'])}"
            for src, pkg in packages if pkg.get("vulnerabilities")]


def sub_dict(project, key):
    value = project.get(key)
    return value if isinstance(value, dict) else {}


def shield_value_problems(project, sh):
    classes, budgets = sub_dict(project, "classes"), sub_dict(project, "budgets")
    problems = [] if project.get("stack") in sh["stacks"] else [f"stack must be one of {', '.join(sh['stacks'])}"]
    problems += [f"classes.{c} must be a list of globs (may be empty)" for c in sh["value_classes"] if not isinstance(classes.get(c), list)]
    problems += [f"budgets.{k} must be a number" for k in sh["budget_keys"] if not isinstance(budgets.get(k), (int, float))]
    return problems


def shield_schema_problems(project, sh):
    problems = [f"missing key '{k}'" for k in sh["required_keys"] if k not in project]
    problems += [f"unknown key '{k}'" for k in project if k not in sh["required_keys"] + sh["optional_keys"]]
    return problems + shield_value_problems(project, sh)


def read_edge(path, count, tail):
    with path.open("rb") as handle:
        if tail:
            handle.seek(max(0, handle.seek(0, os.SEEK_END) - count))
        return handle.read(count)


def embedded_source(path, rel, sh):
    if not matches(rel, sh["source_map_globs"]):
        return ""
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except ValueError:
        return ""
    return "; embeds the original source" if isinstance(data, dict) and data.get(sh["map_source_key"]) else ""


def shield_file_leaks(path, rel, sh):
    found = [f"{rel}: {why} in the release{embedded_source(path, rel, sh)}" for glob, why in sh["leak_files"].items() if matches(rel, [glob])]
    found += [f"{rel}: '{needle}' near the end of the file" for glob, needle in sh["leak_text"].items()
              if matches(rel, [glob]) and needle.encode() in read_edge(path, sh["leak_text_tail_bytes"], True)]
    found += [f"{rel}: {spec['why']}" for glob, spec in sh["plain_metadata"].items()
              if matches(rel, [glob]) and read_edge(path, len(bytes.fromhex(spec["magic_hex"])), False) == bytes.fromhex(spec["magic_hex"])]
    return found


def shield_project(root, sh):
    """The project's shield config and the problems with it; no config file means nothing to check."""
    where = root / sh["project_config"]
    if not where.is_file():
        raise Unavailable(f"no {sh['project_config']}; it needs {', '.join(sh['required_keys'])}")
    try:
        project = json.loads(where.read_text(encoding="utf-8"))
    except ValueError as why:
        return None, [f"{sh['project_config']}: not valid JSON ({why})"]
    problems = shield_schema_problems(project, sh) if isinstance(project, dict) else ["must be a JSON object"]
    return project, [f"{sh['project_config']}: {p}" for p in problems]


def scan_release(root, project, sh):
    release = (root / project["release_dir"]).resolve()
    files = sorted(p for p in release.rglob("*") if p.is_file()) if release.is_dir() else []
    if not files:
        raise Unavailable(f"release_dir '{project['release_dir']}' is missing or empty; build first")
    return [line for p in files for line in shield_file_leaks(p, p.relative_to(release).as_posix(), sh)]


def check_shield(root, cfg):
    sh = cfg["shield"]
    project, problems = shield_project(root, sh)
    if problems:
        return problems
    found = scan_release(root, project, sh)
    uncovered = [c for c in sh["value_classes"] if not project["classes"][c]]
    if uncovered and not found:
        raise Unavailable(f"no leaks found, but these value classes have no globs and are not covered: {', '.join(uncovered)}")
    return found


def report(name, results, cfg):
    """Run one check and print its line. Returns (findings, not_checked)."""
    try:
        found = results[name]()
    except Unavailable as why:
        print(f"[NOT CHECKED] {name}: {why}")
        return 0, 1
    if found is None:
        tool = TOOL_FOR[name]
        print(f"[NOT CHECKED] {name}: {tool} not installed ({cfg['tools'][tool]['install']})")
        return 0, 1
    if not found:
        print(f"[ok] {name}")
        return 0, 0
    print(f"[FAIL] {name}: {len(found)}")
    shown = found[:cfg["max_findings_per_check"]]
    print("\n".join(f"  - {line}" for line in shown))
    if len(found) > len(shown):
        print(f"  ... {len(found) - len(shown)} more")
    return len(found), 0


def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=".")
    scope = ap.add_mutually_exclusive_group()
    scope.add_argument("--staged", action="store_const", const="staged", dest="mode")
    scope.add_argument("--all", action="store_const", const="all", dest="mode")
    ap.add_argument("--only", default=",".join(ALL_CHECKS))
    ap.add_argument("--config", default=str(HERE / "config.json"))
    ap.set_defaults(mode="changed")
    return ap.parse_args()


def main():
    args = parse_args()
    root = Path(args.root).resolve()
    cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    files = list_files(root, args.mode)
    scoped, staged = args.mode != "all", args.mode == "staged"
    results = {
        "size": lambda: check_size(files, root, cfg),
        "plan": lambda: check_plan(files, root, cfg),
        "hardcode": lambda: check_hardcode(files, root, cfg, scoped),
        "secrets": lambda: check_secrets(root, cfg, staged),
        "sast": lambda: check_sast(files, root, cfg, staged),
        "complexity": lambda: check_complexity(files, root, cfg, scoped),
        "architecture": lambda: check_architecture(root, cfg),
        "deps": lambda: check_deps(root, cfg),
        "shield": lambda: check_shield(root, cfg),
    }
    print(f"PUSULA CHECKS root={root} scope={args.mode} files={len(files)}")
    counts = [report(name, results, cfg) for name in args.only.split(",") if name in ALL_CHECKS + OPT_IN]
    total, skipped = (sum(c[k] for c in counts) for k in (0, 1))
    print(f"Result: {'FAIL' if total else 'CLEAN' if not skipped else 'INCOMPLETE'} ({total} findings, {skipped} not checked)")
    sys.exit(1 if total else 2 if skipped else 0)


if __name__ == "__main__":
    main()
