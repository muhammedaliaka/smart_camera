---
name: doubt-driven-development
description: Use before a non-trivial decision stands: architecture choice, risky or irreversible change, security logic, unfamiliar code, or a claim you cannot check mechanically. Self-review in the same session.
license: MIT
---

# Doubt-driven development (adapted)

Adapted from addyosmani/agent-skills `doubt-driven-development`, MIT. Changed: no subagent (single-model rule), same-session adversarial pass, optional cross-model check only with user approval. See THIRD_PARTY.md.

A confident answer is not a correct one. Cross-examine non-trivial decisions while changing course is still cheap.

## Non-trivial means
Branching logic, crossing a module or service boundary, a property the compiler cannot check (thread safety, ordering, idempotence), correctness that depends on hidden context, or an irreversible effect (deploy, migration, public API change).
Do not use it for renames, formatting, file moves, reading code, or one-line changes.

## Order
Run the mechanical checks first (compiler, analyzers, tests). Doubt covers what machines cannot.

## Cycle
1. **Claim.** Two or three lines: what stands, why it matters. No compact claim means a vibe, not a decision.
2. **Extract.** Write the artifact (diff or function, not the file) and the contract (what it must satisfy) as if for a stranger. Leave your reasoning out.
3. **Doubt.** Critique the artifact against the contract only, without looking at your claim. Hunt for: unstated assumptions, unhandled edge cases, hidden coupling or shared state, ways the contract breaks, conventions it violates, failure under unexpected input. Find issues or state that you found none after a real search. Do not validate or summarize.
4. **Reconcile.** Classify each finding in this order: contract was unclear, valid and actionable, valid trade-off (document it), noise. Re-read the artifact before classifying; do not rubber-stamp yourself.
5. **Stop** when findings are trivial, after three cycles (then tell the user), or when the user says ship it.

A same-session review shares your blind spots. Label the result "same-session review" in the report.

## Optional cross-model check
Another model catches different mistakes. Offer it once per cycle when stakes are high. Only with the user's explicit yes for that exact command: write the prompt, artifact and contract to a file and pipe it by stdin to a read-only call (for example Codex or Gemini CLI). Never put the artifact inside a quoted shell argument. If the tool is missing or fails, say so; do not silently fall back.

## Red flags
Doubting a trivial change. Asking "is this good?" instead of "find what is wrong". More than three cycles. Two cycles with real findings and none actionable (you are validating, not doubting).
