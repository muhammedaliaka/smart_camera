# A/B raw data (anonymized)

One folder per round (`r1` = results 2026-10-25b round 1, `r2` = round 2, `r3` = results 2026-10-25c).
- `answers/rNNN.txt`: model answers, shuffled; the header names the probe only.
- `scores.json`: hand scores per answer id and item (0 or 1). Item text: `tests/ab/PREREG.md`.
- `key.json`: answer id to `probe-arm-run`. Opened only after scoring.

Re-sum the scores (needs only these files):

    python3 -c "import json,collections,sys;d=sys.argv[1];k=json.load(open(d+'/key.json'));s=json.load(open(d+'/scores.json'));a=collections.defaultdict(list)
    [a[tuple(v.split('-')[:2])].append(sum(s[r].values())) for r,v in k.items() if r in s]
    [print(x,y,sum(y)/len(y)) for x,y in sorted(a.items())]" pusula/tests/results/data/r3

Run logs (tool calls, cost, turns) are not kept (about 60 MB); `grade_ab.py report` needs them, so the cost and pack-read columns in the results files cannot be regenerated without a fresh run.
