---
name: interview-me
description: Use when a request is underspecified or ambiguous, before any plan or code, or when the user says "interview me" or "are we sure?". Asks one question at a time with a guess, until the intent is confirmed.
license: MIT
---

# Interview me (adapted)

Adapted from addyosmani/agent-skills `interview-me`, MIT. Added: question cap, UI reference rule, choice-tool use, permission capture. See THIRD_PARTY.md.

People ask for what they know how to name, not always for what they want. Close that gap before any plan or code exists.

## Skip it when
The ask is clear and self-contained, it is a pure question, a mechanical edit, or the user already wrote a detailed brief (restate it instead). Do not run it in non-interactive contexts; flag the missing information as a blocker.

## Process
1. **Hypothesis.** In one sentence, what you think they want, plus a confidence number. Under 70%: add what is missing.
2. **One question at a time**, each with your guess attached. If the host has a choice-question tool (for example AskUserQuestion), use it with 2 to 4 options and a recommended first option. Never batch three questions into one message.
3. **Listen for "should want".** Buzzwords ("scalable", "modern", "clean") or "the standard way" need one probe: "If you did not have to justify this to anyone, what would you want?"
4. **Restate** in their words, six lines: Outcome, User, Why now, Success, Constraint, Out of scope. "Out of scope" is mandatory.
5. **Confirm.** Only an explicit yes counts. "Whatever you think", "sounds good" or silence are not yes: re-ask with two concrete options.
6. **Stop.** After the yes, deliver the confirmed intent and stop. Do not start downstream work in the same turn unless the user already asked for it.

## Stop rule
Done when you can predict the user's reaction to your next three questions. Cap: five questions. If you still cannot predict, say so and ask whether something foundational is missing.

## Pusula additions
- **UI work:** ask for a reference (screenshot, game, site) and for acceptance criteria. No reference: propose two described options and get a pick.
- **Grants:** when the user allows something ("you may edit anything under src/"), write it to `.pusula/permissions.md` and do not ask again.
- **Understanding note:** for any large task, start with a short "Anladığım" note (my reading of your request) so the user can correct it.
