---
name: code-simplification
description: Use when working code is harder to read or maintain than it should be, or when reviewing accumulated complexity. Simplify without changing behavior.
license: MIT
---

# Code simplification (trimmed)

Adapted from addyosmani/agent-skills `code-simplification`, MIT. See THIRD_PARTY.md.

Goal: code a new teammate understands faster. Fewer lines is not the goal.

## Five principles
1. **Preserve behavior exactly.** Same outputs, errors, side effects and ordering. Unsure? Do not change it.
2. **Follow project conventions.** Read the project rules and neighboring code first. Imposing your style is churn.
3. **Clarity over cleverness.** Nested ternaries, dense chains and one-line puzzles become named steps.
4. **Keep balance.** Do not inline a helper that names a concept, merge unrelated functions, or remove abstractions that exist for testing.
5. **Scope to what changed.** No drive-by refactors.

## Process
1. **Understand first** (Chesterton's fence). What does it do, who calls it, why might it be written this way, what tests define it? Cannot answer: read more.
2. **Spot candidates:** nesting of 3 or more levels, functions over 50 lines, boolean flag parameters, repeated conditions, generic names (`data`, `temp`), duplicated blocks of 5 or more lines, dead code, wrappers that add nothing, comments that explain "what" (keep the "why" ones).
3. **Change one thing at a time.** Run tests after each. Pass: continue. Fail: revert. Keep refactors out of feature or bug-fix changes.
4. **Compare before and after.** If it is not clearly easier to read, revert.

Touching more than 500 lines by hand? Use a codemod or script.

## Red flags
Tests had to change (behavior changed). Longer and harder code. Error handling removed. Code you do not understand. One huge mixed commit.

## Check
Existing tests pass unchanged, no new warnings, diff is clean and scoped, error handling intact, no dead code left behind.
