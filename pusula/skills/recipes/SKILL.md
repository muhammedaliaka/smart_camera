---
name: recipes
description: Use at the start of any task to pick which Pusula skills to load and in what order. Maps task types to skill combinations and lists known conflicts.
license: MIT
---

# Recipes (the router)

Load only the skills a recipe names. Do not load the rest. If these recipes and a skill disagree, AGENTS.md wins, then recipes, then the skill.

| Task | Load, in order | Done when |
|---|---|---|
| Unclear or large request | `interview-me`, then `state-files` | The user said an explicit yes to the restated intent |
| Research, library choice, migration | `source-driven-development`, `state-files` (findings), `doubt-driven-development` on the conclusion | Every claim has an official link or "unverified"; mapping table complete for migrations |
| Plan for big or irreversible work | `writing-plans`, `state-files` (plan template), `doubt-driven-development` | Every step has a check, every code block is labelled, the user approved |
| Build a feature | `ponytail`, `test-driven-development` (logic only), `verification-before-completion` | Evidence table satisfied |
| UI work | `interview-me` (reference), `ui-acceptance` (criteria first, screenshots last), `ponytail`, `verification-before-completion` | Every criterion row is pass or reported "not seen" |
| Explain, report or answer "I do not understand" | `plain-explain` | Result first, certainty labels on non-obvious claims |
| Bug or failing test | `systematic-debugging`, `test-driven-development`, `verification-before-completion` | Root cause named, regression test red-green proven |
| New module, folder, layer or dependency; change touching 6+ files; naming, complexity, logs | `architecture-standard`, then `ponytail`, `verification-before-completion` | Architecture file current, `pusula_check.py` clean |
| Refactor or cleanup | `code-simplification`, `verification-before-completion` | Existing tests pass unchanged |
| Input, auth, secrets, uploads, dependencies, LLM features | `security-and-hardening`, `verification-before-completion` | Security check list in the skill passes |
| Any claim of "done" | `verification-before-completion` | Always last |
| Long session | `state-files` (handoff note) | Note written, one page |

## Conflicts already settled
- No subagents, even where a skill suggests them. `doubt-driven-development` reviews in the same session.
- TDD applies to logic, not to UI layout or config.
- Plan code is allowed only when reasoned and labelled (`Why code:`, `Checked:`); the implementer verifies it before use.
- Short answers do not replace plain Turkish explanations.
- Skills never lower a rule in AGENTS.md.

## Not installed yet
Domain packs: Tauri and Rust, Unity, Unreal, Flutter, Next.js, three.js and GLB, AI asset production, marketing, sales, video. For these, say so, then use `source-driven-development` on the official docs. Do not improvise from memory.
