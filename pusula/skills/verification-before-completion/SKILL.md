---
name: verification-before-completion
description: Use before claiming work is done, fixed or passing, and before commit. Requires fresh evidence (commands, static analysis, and for UI a screenshot checked against the criteria).
license: MIT
---

# Verification before completion (adapted)

Adapted from obra/superpowers `verification-before-completion`, MIT. Added: static-analysis gate, UI gate, own-tests rule. See THIRD_PARTY.md.

**Evidence before claims.** No "done", "fixed" or "passing" without evidence from this session.

## Gate
1. Name the command or check that proves the claim.
2. Run it in full, fresh.
3. Read the whole output. Check exit code, failures and warnings.
4. If it confirms the claim, report the claim with the evidence. If not, report the real state.

## Which evidence proves which claim
| Claim | Needs | Not enough |
|---|---|---|
| Builds | Build command (the Stack section of `.pusula/architecture.md`; none: package scripts, CI file), exit 0, warnings read | Linter passed (linter is not a compiler) |
| Tests pass | Full project suite output, 0 failures | A previous run, "should pass" |
| Static analysis clean | The repo's analyzers and linters, 0 new findings (compiler warnings, type check) plus `python .pusula/checks/pusula_check.py` when present: file size, labelled plan code, hardcoded values (Semgrep), secrets (gitleaks), dependencies (osv-scanner) | Only your own tests |
| Bug fixed | Original symptom retested and gone | "Code changed" |
| Regression test is real | Red-green: pass, revert the fix, must fail, restore, pass | One pass |
| UI is right | Screenshot of the running UI judged line by line against the written acceptance criteria (`ui-acceptance`) | "Looks fine", code review only |
| Requirements met | Line-by-line checklist against the request | Tests pass |
| Other agent finished | VCS diff shows the change | The agent said success |
| Secrets safe | Scan of the diff for keys and tokens (gitleaks or grep) | "I did not add any" |

## Rules
- Your own tests prove only what you thought of. Also run the checks you did not write: compiler, analyzers, existing suite.
- UI needs written acceptance criteria before you build. No criteria: ask, or propose them and get a yes. A UI you never saw is not verified.
- Report every failure the run shows, by name, even one you did not cause.
- A check you could not run is reported as "not checked", with the reason. The Pusula checks print `[NOT CHECKED]` for a missing tool and exit 2; never read that as a pass.
- Wording like "should", "probably", "seems", or cheering before the run means you skipped the gate.
- Verify before commit, push, PR, the next task, and before handing work to another agent.
