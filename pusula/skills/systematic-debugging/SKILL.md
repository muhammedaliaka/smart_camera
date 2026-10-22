---
name: systematic-debugging
description: Use on any bug, failing test, build error or unexpected behavior, before proposing a fix. Find the root cause first.
license: MIT
---

# Systematic debugging (trimmed)

Adapted from obra/superpowers `systematic-debugging`, MIT. See THIRD_PARTY.md.

**No fix without a root cause.** A symptom fix is a failure.

## 1. Investigate
- Read the full error: message, stack, file, line, code.
- Reproduce it reliably. If you cannot, gather more data; do not guess.
- Check what changed: diff, recent commits, new dependencies, config, environment.
- Several components (build, service, database)? Log what enters and leaves each boundary once, find where it breaks, then dig there.
- Trace the bad value backward to where it starts. Fix at the source.

## 2. Compare
Find similar working code. Read the reference completely. List every difference, however small. Note the dependencies and assumptions.

## 3. Test one hypothesis
Write it down: "X is the cause because Y." Make the smallest change that tests it, one variable at a time. Wrong? Form a new hypothesis; do not stack fixes. If you do not understand something, say so.

## 4. Fix
- Make a failing test or repro first (`test-driven-development`).
- One change for the root cause. No "while I am here" edits.
- Verify with the full suite (`verification-before-completion`).
- Three failed fixes means the design may be wrong. Stop and tell the user what you tried, what you saw, and what you suspect.

## Stop and restart at step 1 if you think
"quick fix now, investigate later", "just try X", "change several things and run", "it is probably X", or "one more attempt" after two failures.

If the cause is truly external or timing-dependent: document what you checked, add handling (retry, timeout, clear error) and logging. Most "no root cause" cases are unfinished investigations.
