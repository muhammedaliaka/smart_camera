#!/usr/bin/env python3
"""Build Shield report: how much of the plain build's names, strings and constants REA still finds in the protected build.

Usage: python shield_report.py PLAIN.json PROTECTED.json [--root DIR] [--config FILE] [--rea-version V] [--measure KEY PLAIN PROTECTED]...
PLAIN.json and PROTECTED.json are REA analysis outputs (`rea analyze-javascript-application <dir> --format json`) of the same
project; the extractor is picked from their `operation` field (shield.report.extractors in config.json).
Needs .pusula/shield.config.json (see pusula_check.py --only shield): value classes, exclude globs and budgets.
--measure takes a budget key (max_startup_ms_growth, max_frame_ms_growth) and the value measured on each build.
Size growth is read from the directories REA analyzed. Prints markdown tables.
Exit codes: 0 within every budget, 1 over a budget or bad config, 2 nothing could be judged (no config, unreadable or unknown
analysis, a class without canaries, a budget not measured).
"""
import argparse
import json
import re
import sys
from pathlib import Path

from pusula_check import HERE, Unavailable, matches, shield_project


def dig(obj, path):
    for key in path:
        obj = obj.get(key) if isinstance(obj, dict) else None
    return obj


def load_analysis(path, rep):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError) as why:
        raise Unavailable(f"{path}: cannot read ({why})") from why
    operation = data.get("operation") if isinstance(data, dict) else None
    if operation not in rep["extractors"]:
        raise Unavailable(f"{path}: no extractor for operation '{operation}'; add one under shield.report.extractors")
    return data, operation


def node_passes(node, rule):
    where = rule.get("where")
    return where is None or dig(node, where["path"]) == where["equals"]


def reported_values(data, spec):
    """(module path, value) for every node of a wanted kind; numbers stay numbers, booleans and empty values are dropped."""
    found = set()
    for node in dig(data, spec["nodes"]) or []:
        rule = spec["kinds"].get(node.get("kind"))
        value = dig(node, rule["value"]) if rule and node_passes(node, rule) else None
        if value not in (None, "") and not isinstance(value, bool):
            found.add((dig(node, spec["path"]), value))
    return found


def is_number(value):
    return isinstance(value, (int, float))


def class_of(path, project, rep):
    """Class name, or None when the path is excluded. Paths in no class are reported under their own row."""
    if path and matches(path, project.get("exclude", [])):
        return None
    return next((name for name, globs in project["classes"].items() if path and matches(path, globs)), rep["unclassified"])


def still_found(value, numbers, text):
    """Numbers are compared as values (line numbers in the text must not count); strings must stand alone as a word or path."""
    if is_number(value):
        return value in numbers
    return value in text and re.search(rf"(?<![\w$]){re.escape(value)}(?![\w$])", text) is not None


def recall_rows(plain, protected_data, protected, project, rep):
    """Per class: [canaries, still found]; also how many were skipped as too short and how many excluded."""
    text = json.dumps(protected_data, ensure_ascii=False)
    numbers = {v for _, v in protected if is_number(v)}
    rows = {name: [0, 0] for name in [*project["classes"], rep["unclassified"]]}
    skipped = excluded = 0
    for path, value in sorted(plain, key=repr):
        name = class_of(path, project, rep)
        if name is None:
            excluded += 1
        elif len(str(value)) < rep["min_length"]:
            skipped += 1
        else:
            rows[name][0] += 1
            rows[name][1] += still_found(value, numbers, text)
    return rows, skipped, excluded


def tree_bytes(path):
    folder = Path(path) if path else None
    return sum(f.stat().st_size for f in folder.rglob("*") if f.is_file()) if folder and folder.is_dir() else None


def growth(kind, before, after):
    if before is None or after is None:
        return None
    return (after - before) / before * 100 if kind == "pct" and before else after - before


def measured_pairs(args, rep):
    pairs = {}
    for key, before, after in args.measure:
        if key not in rep["growth_kind"]:
            raise Unavailable(f"--measure: '{key}' is not a budget key ({', '.join(rep['growth_kind'])})")
        try:
            pairs[key] = (float(before), float(after))
        except ValueError as why:
            raise Unavailable(f"--measure {key}: {why}") from why
    return pairs


def budget_rows(project, rep, datas, measured):
    sizes = [tree_bytes(dig(d, ["subject", "local_path"])) for d in datas]
    values = {key: growth(rep["growth_kind"][key], *pair) for key, pair in {rep["size_budget"]: sizes, **measured}.items()}
    return [(key, project["budgets"][key], values.get(key)) for key in rep["growth_kind"]]


def status(limit, value):
    return "NOT MEASURED" if value is None else "OVER" if value > limit else "ok"


def class_state(name, total, hit, limit, unclassified):
    if not total:
        return "ok" if name == unclassified else "NOT COVERED"
    return status(limit, hit / total * 100)


def render(rows, budgets, limit, unclassified):
    lines = ["| Class | Canaries | Still found by REA | Recall % | Status |", "| --- | --- | --- | --- | --- |"]
    states = []
    for name, (total, hit) in rows.items():
        states.append(class_state(name, total, hit, limit, unclassified))
        lines.append(f"| {name} | {total} | {hit} | {f'{hit / total * 100:.0f}' if total else '-'} | {states[-1]} |")
    lines += ["", "| Budget | Limit | Measured | Status |", "| --- | --- | --- | --- |"]
    for key, cap, value in budgets:
        states.append(status(cap, value))
        lines.append(f"| {key} | {cap} | {'-' if value is None else f'{value:.1f}'} | {states[-1]} |")
    return lines, states


def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("plain")
    ap.add_argument("protected")
    ap.add_argument("--root", default=".")
    ap.add_argument("--config", default=str(HERE / "config.json"))
    ap.add_argument("--rea-version", default="not recorded")
    ap.add_argument("--measure", nargs=3, action="append", default=[], metavar=("KEY", "PLAIN", "PROTECTED"))
    return ap.parse_args()


def run(args):
    cfg = json.loads(Path(args.config).read_text(encoding="utf-8"))
    sh, rep = cfg["shield"], cfg["shield"]["report"]
    project, problems = shield_project(Path(args.root).resolve(), sh)
    if problems:
        print("\n".join(f"[FAIL] {p}" for p in problems))
        return 1
    measured = measured_pairs(args, rep)
    (plain_data, op), (protected_data, other) = (load_analysis(p, rep) for p in (args.plain, args.protected))
    if op != other:
        raise Unavailable(f"the two analyses differ in operation ('{op}' vs '{other}')")
    spec = rep["extractors"][op]
    plain, protected = reported_values(plain_data, spec), reported_values(protected_data, spec)
    rows, skipped, excluded = recall_rows(plain, protected_data, protected, project, rep)
    budgets = budget_rows(project, rep, (plain_data, protected_data), measured)
    lines, states = render(rows, budgets, project["budgets"]["max_recall_pct"], rep["unclassified"])
    print(f"Build Shield report. REA version: {args.rea_version}. Operation: {op}. Stack: {project['stack']}.")
    print("\n".join(lines))
    print(f"\nSkipped as shorter than {rep['min_length']} characters: {skipped}. Excluded by config: {excluded}.")
    print("Recall counts a name, string or number as found when REA still reports it; it says nothing about a deobfuscator or a model.")
    return 1 if "OVER" in states else 2 if any(s in ("NOT COVERED", "NOT MEASURED") for s in states) else 0


def main():
    try:
        code = run(parse_args())
    except Unavailable as why:
        print(f"[NOT CHECKED] shield report: {why}")
        code = 2
    sys.exit(code)


if __name__ == "__main__":
    main()
