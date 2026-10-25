#!/usr/bin/env python3
"""Grade the pack A/B logs.

  grade_ab.py anon WORKDIR            write shuffled, arm-free answers to WORKDIR/answers/<id>.txt + key.json
  grade_ab.py report WORKDIR SCORES   SCORES = {"<id>": {"1": 1, "2": 0, ...}}; merges with the key, audits pack reads,
                                      prints the tables (manual scores; regex hits as a cross-check)
The key is never shown while scoring: score the answers first, then run `report`.
"""
import json
import random
import re
import sys
from pathlib import Path

EXPECTED = {"p1": "sales.md", "p2": "ai-production.md", "p3": "nextjs.md", "p4": "threejs-glb.md"}
ITEMS = {"p1": 9, "p2": 9, "p3": 9, "p4": 8, "p5": 3}
# Cross-check only: crude patterns for the items a regex can see. Manual scores decide.
REGEX = {
    "p1": {1: r"\$\s?100\b|\b100\s?(\$|usd|dolar)", 2: r"30\s*(gün|day)", 3: r"(iki|2)\s*hafta|two weeks|14\s*(gün|day)",
           4: r"3\s*[-–]\s*5\s*(iş|business)|7\s*(gün|day)", 7: r"15\s*[-–]\s*30", 8: r"partner\.steamgames|doğrula|unverified|resmi"},
    "p2": {1: r"cc[- ]by[- ]nc|non-?commercial|ticari\w* (değil|kullanıl\w* (yok|olmaz))", 2: r"(AB|EU|Avrupa|Almanya|Germany).{0,200}(kapsam|geçerli|apply|excluded|dışında)",
           6: r"disclos|beyan|bildir\w* (formu|anketi)|content survey", 7: r"copyright|telif"},
    "p3": {1: r"public|herkese açık|açık (uç|endpoint)", 3: r"owner|sahip", 4: r"zod|valid|doğrula",
           7: r"next build.{0,200}(lint|eslint)|(lint|eslint).{0,200}next build"},
    "p4": {1: r"DRACOLoader|setDRACOLoader", 2: r"dispose", 4: r"renderer\.info", 5: r"validator|gltf-validator", 6: r"three/addons", 7: r"gltf-transform"},
}


def tool_calls(events):
    for e in events:
        if e.get("type") != "assistant":
            continue
        for block in e.get("message", {}).get("content", []):
            if block.get("type") == "tool_use":
                yield block["name"], block.get("input", {})


def parse(path):
    ev = [json.loads(line) for line in Path(path).read_text(encoding="utf-8").splitlines() if line.strip()]
    result = next((e for e in reversed(ev) if e.get("type") == "result"), {})
    calls = list(tool_calls(ev))
    skills = [args.get("skill", "") for name, args in calls if name == "Skill"]
    reads = [args.get("file_path", "") for name, args in calls if name == "Read"]
    return {"text": result.get("result", ""), "cost": result.get("total_cost_usd", 0.0), "turns": result.get("num_turns", 0),
            "error": bool(result.get("is_error", True)), "skills": skills, "reads": reads}


def runs(work):
    for path in sorted((work / "logs").glob("*.jsonl")):
        probe, arm, n = path.stem.split("-")
        yield path.stem, probe, arm, parse(path)


def anon(work):
    out = work / "answers"
    out.mkdir(exist_ok=True)
    names = [name for name, *_ in runs(work)]
    ids = random.Random(20261025).sample(range(100, 100 + len(names)), len(names))
    key = {f"r{i}": name for name, i in zip(names, ids)}
    data = {name: info for name, *_, info in runs(work)}
    for rid, name in key.items():
        probe = name.split("-")[0]
        (out / f"{rid}.txt").write_text(f"[probe {probe}]\n{data[name]['text']}\n", encoding="utf-8")
    (work / "key.json").write_text(json.dumps(key, indent=1), encoding="utf-8")
    print(f"{len(key)} answers in {out}; key in key.json (do not open before scoring)")


def pack_hits(info, probe):
    wanted = EXPECTED.get(probe)
    return {"recipes": "recipes" in info["skills"], "index": any(r.endswith("packs/INDEX.md") for r in info["reads"]),
            "expected": bool(wanted) and any(r.endswith("/" + wanted) for r in info["reads"]),
            "any_pack": any("/packs/" in r for r in info["reads"]), "skills": info["skills"]}


def score_row(probe, arm, data, got):
    pattern = REGEX.get(probe, {})
    hits = {i: bool(re.search(p, data["text"], re.I | re.S)) for i, p in pattern.items()}
    diff = [i for i, h in hits.items() if h != bool(got.get(str(i)))]
    return {"score": sum(int(v) for v in got.values()), "diff": diff, "cost": data["cost"], "turns": data["turns"],
            "words": len(data["text"].split()), "audit": pack_hits(data, probe) if arm == "B" else None, "error": data["error"]}


def collect(work, key, scores):
    info = {name: (probe, arm, data) for name, probe, arm, data in runs(work)}
    table = {}
    for rid, name in key.items():
        probe, arm, data = info[name]
        got = scores.get(rid)
        if got is None:
            print(f"missing score for {rid} ({name})")
            continue
        table.setdefault((probe, arm), []).append({"name": name, **score_row(probe, arm, data, got)})
    return table


def print_table(table):
    print("probe arm  scores        mean  of  cost($)  turns words  regex-vs-manual disagreements")
    for (probe, arm), rows in sorted(table.items()):
        scores_list = [r["score"] for r in rows]
        mean = sum(scores_list) / len(rows)
        print(f"{probe}    {arm}    {str(scores_list):13} {mean:4.1f}  {ITEMS[probe]:2}  {sum(r['cost'] for r in rows) / len(rows):6.3f}  "
              f"{sum(r['turns'] for r in rows) / len(rows):4.1f} {sum(r['words'] for r in rows) / len(rows):5.0f}  "
              f"{[(r['name'], r['diff']) for r in rows if r['diff']]}")


def print_audit(table):
    print("\nB pack-read audit (recipes skill / INDEX read / expected pack read / any pack)")
    for (_, arm), rows in sorted(table.items()):
        for r in rows if arm == "B" else []:
            a = r["audit"]
            print(f"{r['name']}: recipes={a['recipes']} index={a['index']} expected={a['expected']} any={a['any_pack']} skills={a['skills']}")


def report(work, scores_path):
    key = json.loads((work / "key.json").read_text(encoding="utf-8"))
    scores = json.loads(Path(scores_path).read_text(encoding="utf-8"))
    table = collect(work, key, scores)
    print_table(table)
    print_audit(table)
    errors = [r["name"] for rows in table.values() for r in rows if r["error"]]
    print("runs flagged is_error:", errors or "none")


if __name__ == "__main__":
    cmd, work = sys.argv[1], Path(sys.argv[2])
    anon(work) if cmd == "anon" else report(work, sys.argv[3])
