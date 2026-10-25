---
name: test-driven-development
description: Use when implementing new logic or fixing a bug. Write a failing test first, see it fail for the right reason, then write minimal code. Not for UI layout, config or generated code.
license: MIT
---

# Test-driven development (adapted)

Adapted from obra/superpowers `test-driven-development`, MIT. Changed: scope limited to logic; UI and config use acceptance criteria instead; "delete the code" replaced by a red-green proof. See THIRD_PARTY.md.

## When
Required: new logic, bug fixes, parsers, money, security, behavior changes.
Not required: UI layout and styling, config files, generated code, throwaway prototypes. These are checked with acceptance criteria and a screenshot or inspection (`verification-before-completion`).

## Cycle
1. **Red.** Write one small test for one behavior. Clear name. Real code, no mocks unless unavoidable. Before writing it, name the production change that would make it fail.
2. **Prove red.** Run it. It must fail, not error, and fail for the expected reason (feature missing, not a typo). If it passes, you are testing existing behavior; fix the test.
3. **Green.** Write the simplest code that passes. No extra features, no options.
4. **Prove green.** Run the project's whole suite, not just your file. Output must be clean. Report any failure by name, even one you did not cause.
5. **Refactor.** Only after green. Remove duplication, improve names. Add no behavior. Stay green.

## Code came first?
Write the test now, then prove it can fail: revert the code change, run (must fail), restore, run (must pass).

## Test quality
- One behavior per test. "and" in the name means split it.
- Assert on real behavior, never on mock behavior.
- Keep test-only code out of production classes.
- Understand a dependency's side effects before mocking it.
- Hard to test usually means the design is too coupled; simplify the interface.

## Bug fix
Write a failing test that reproduces it first. The test proves the fix and prevents the regression.
