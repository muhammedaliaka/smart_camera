# Pack: Security audit (sources and workflow)

Read when the task is a security review, a hardening pass, or a release gate. The rules themselves live in the `security-and-hardening` skill; this file adds the official source map and an audit order. Facts read 2026-10-25. Labels: [official], [reasoning], [unverified].

## Sources first
- OWASP Top 10:2025 (https://top10.owasp.org/2025): A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions. [official]
- ASVS 5.0.0, published 30 May 2025 (https://asvs.owasp.org/): the checklist to cite when a requirement is needed. Level wording not read. [official]
- LLM features, OWASP Top 10 for LLM Applications 2025 (https://genai.owasp.org/llm-top-10/): LLM01 Prompt Injection, 02 Sensitive Information Disclosure, 03 Supply Chain, 04 Data and Model Poisoning, 05 Improper Output Handling, 06 Excessive Agency, 07 System Prompt Leakage, 08 Vector and Embedding Weaknesses, 09 Misinformation, 10 Unbounded Consumption. [official]
- Mobile: OWASP Mobile Top 10, 2024 release is current on its project page; category names not read. [official]
- CI: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions.
- Desktop shells: Tauri (`packs/tauri-rust.md`); shipped-build copying (`security-and-hardening/anti-copy.md`).

## Checks (audit order, cheapest evidence first)
1. Scope: what is audited, what is not, which threat (casual user, attacker with the app, insider). Write it in `.pusula/<task>/progress.md`.
2. Run the mechanical checks: `python .pusula/checks/pusula_check.py --only sast,secrets,deps`. A check that did not run is "not checked", never clean.
3. Map entry points and trust boundaries by reading the router, handlers, IPC commands, webhooks and file readers. Authorization on each resource.
4. Read the code the tools miss: weak random for tokens, XML from untrusted sources, `innerHTML`, weak hashes in non-Python code (see the skill's tool note).
5. Report each finding as: file and line, the attack in one sentence, severity, fix, test that fails before and passes after. Fix only what the user asked; list the rest.
6. Re-run step 2 and show the output. No "secure" claims: say what was checked.

## CI rules (official hardening page, summarized)
- Pin third-party actions to a full commit SHA from the action's own repo; a tag only if you trust its owner.
- Default `GITHUB_TOKEN` to read-only; widen per job.
- Never put untrusted input such as a pull request title straight into a `run` script; pass it through an environment variable. Quote shell variables.
- Do not combine `pull_request_target` or `workflow_run` with checking out pull request code.
- A secret printed in a log: delete the log, rotate the secret. Store each secret as its own value. [official]

## Traps
- Counting tool findings as the audit. On our 19-flaw test Semgrep flagged 15 (see the skill).
- A security finding fixed with a big rewrite. Smallest fix, then a test.
- Quoting a standard from memory. Cite the page above with its version.

## Done when
Scope is written, all mechanical checks ran or are marked not checked, every finding has a test, and the report names what was not looked at.
