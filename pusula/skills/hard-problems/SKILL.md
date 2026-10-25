---
name: hard-problems
description: Use when a feature needs hard logic, math, geometry, scheduling or an algorithm you cannot check by reading. Exact spec, known solution, slow reference, random comparison, then the fast version.
license: MIT
---

# Hard problems

Hard logic fails quietly: the code runs and the answer is wrong. Do not trust a clever version until a dumb version agrees with it.

## Method
1. **Pin it.** Write inputs, outputs, ranges and three worked examples whose answers you computed by hand, not with the code. Keep it under 20 lines in `.pusula/<task>/spec.md`. Unclear: `interview-me`.
2. **Known solution first.** Is it a named problem? Look in the language standard library, platform docs, a maintained library, a textbook or a paper. Official sources first; label the rest "not official". Use a library when integrating it costs under half of writing it.
3. **Slow reference.** Write the simplest correct version: brute force, exact integers or fractions. It may be too slow to ship. It is the oracle.
4. **Split.** Still hard: cut it into parts you can check alone. Write each part's invariant in one sentence ("the list stays sorted", "total mass is kept").
5. **Compare.** Run the real version and the reference on many random inputs with a seeded generator; print the seed so a failure replays. Always include these edges: empty, one item, duplicates, zero, negative, ties, touching or equal values, the largest size.
6. **Numbers.** Money, scores and anything compared for equality or replayed (lockstep, multiplayer, replays) use integers, fixed-point or decimals, never floats. Float results: compare with a stated tolerance. State the value range and check the type fits.
7. **Same answer everywhere.** Same input gives the same output on every machine: seed all randomness; never let unordered iteration change a result.
8. **Fast version only if measured slow** (N9). Check it against the reference with the same inputs.
9. **Three strikes** (`systematic-debugging`): after three failed fixes stop. Report what you know, what you tried, what you need. Do not stack guesses.

## Done means
A table: hand examples pass, edges pass, reference equals real version on N random cases (give N and the seed). Anything not covered: "not seen".
