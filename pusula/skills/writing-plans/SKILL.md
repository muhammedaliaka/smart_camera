---
name: writing-plans
description: Use when turning a spec or request into a multi-step implementation plan, before touching code. File map, task sizing, steps with checks, the code-in-plan rule, self-review.
license: MIT
---

# Writing plans (adapted)

Adapted from obra/superpowers `writing-plans`, MIT. Changed: plan lives in `.pusula/`, no subagent handoff, labelled-code rule, Pusula coverage list. See THIRD_PARTY.md.

Write for an engineer or agent who has not seen this codebase. They write good code once they know the interface and the test. What they cannot know is what you decided: files, names, signatures, spec values, and the test that proves each task. Write those down.

## Where
`.pusula/<task-slug>/plan.md`, from the `state-files` template. A spec with independent subsystems gets one plan per subsystem; each plan yields working, testable software.

## Build the plan
1. **File map first.** Which files are created or changed, and what each is responsible for. One job per file, focused files, follow existing patterns. Splitting a bloated file you must touch is fine.
2. **Tasks.** The smallest unit that carries its own test cycle and a deliverable testable alone. Fold setup, config and docs into the task that needs them. Each task lists Files (create, modify, test) and Interfaces it consumes and produces, with exact names and types. An implementer sees only their own task.
3. **Steps.** One action, one checkable result: write the test, run it (expect fail), implement, run it (expect pass), commit.
4. **Coverage and risks.** Fill the 12-heading Coverage and the pre-mortem from the template. Add a Review Focus list: up to five inputs or failure modes the spec implies but no test covers, each with a test in the task that owns the code.
5. **UI tasks** carry written acceptance criteria and the reference the user approved.

## What a step contains
Enough that exactly one reasonable thing can be written, and nothing more.
- Test step: the test name and assertions, with the spec's exact values.
- Code step: file, exact signature, specific values. A body only for an algorithm the signature and tests do not determine, or for text the spec fixes.
- Verification step: the command and the output that means pass.
- Work of another task: point to its Interfaces; do not repeat its code.

Lines that decide nothing ("handle edge cases", "add validation", "TBD") are gaps.

## Code in a plan
Plan code is a claim. It is allowed only when prose cannot pin the point, and only when it is reasoned.
- Above every block write `Why code:` (why prose is not enough) and `Checked:` (official URL, ran in this session, or UNVERIFIED).
- No speculative bodies. A plan longer than the code it describes has written the code instead.
- The implementer treats plan code as a contract. They check it against the codebase and the docs before use. On conflict they stop and report; they never paste blindly.

## Self-review (you, no subagent)
1. Spec coverage: every requirement points to a task.
2. Step scan: each step allows one reasonable thing and carries no more. Fix both gaps and transcripts.
3. Type consistency: names and signatures in later tasks match earlier tasks.
4. Review Focus: each line has a test in the owning task. An empty list means you checked, not that you skipped.
5. Proportion: a plan several times longer than the spec is a transcript. Swap bodies for signatures and test names.
6. Code labels: every code block has both `Why code:` and `Checked:`.

## Handoff
Link the plan, ask the user whether it captures what they want, and wait for a yes. Then implement in this session, one task at a time, no subagents, with `verification-before-completion` after each task.
