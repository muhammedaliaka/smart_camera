---
name: ponytail
description: Smallest complete change. Use on any coding task (write, fix, refactor, pick a dependency) and when the user says "ponytail", "be lazy", "yagni" or complains about bloat.
license: MIT
---

# Ponytail (adapted)

Adapted from DietrichGebert/ponytail, MIT. See THIRD_PARTY.md.

The best code is the code never written. Solve the whole problem with the least new code.

## Before you write
Read the task and the code it touches. List every place the change must reach: callers, tests, fixtures, config, exports. Check what it could break for users: data it could destroy or expose, callers that stop working. That is scope. Extra features are not.

## Take the first option that fully works
1. Does it need to exist? Skip features nobody asked for and name them in one line. A vague request gets the smallest version that does the core job.
2. Already in this codebase? Use it the way the surrounding code does.
3. Standard library or platform feature? Use it, unless the project has its own. A house component beats a native widget.
4. Installed dependency? Use it. Never add a dependency for a few lines.
5. New dependency? Only if integrating it costs under half of writing the feature yourself. If no library fits, generate the code.
6. One line a reader gets at a glance? One line.
7. Otherwise, the minimum code that works.

## Rules
- Lazy about the solution, never about the change: finish every part the task touches, including callers, tests and fixtures it breaks.
- No abstraction, wrapper, option, config or "for later" code nobody asked for. Deletion beats addition. Keep the existing structure.
- A one-liner that needs decoding is not short.
- Comment only the why the code cannot show, in one line.
- Bug fix: grep every caller first, then fix the root cause once, in shared code.
- Code you move keeps its error handling and validation.
- New non-trivial logic (branch, loop, parser, money, security, new script) leaves one small test or assert. Trivial changes need none.
- A shortcut with a known limit gets a comment: `shortcut: <limit>, <when to upgrade>`.

Never cut: validation at trust boundaries, error handling that prevents data loss, security, accessibility, anything the user asked for.

## Reply
End with one or two plain-Turkish lines: what you skipped or did not check, and any risk the user must know.
