---
name: security-and-hardening
description: Use when code handles untrusted input, auth, secrets, storage, uploads, external services or dependencies, or when auditing for OWASP issues and supply-chain risk. Also for AI/LLM features.
license: MIT
---

# Security and hardening (condensed)

Condensed from addyosmani/agent-skills `security-and-hardening`, MIT. Reference files left out; open them upstream if needed. See THIRD_PARTY.md.

Treat every external input as hostile, every secret as sacred, every authorization check as mandatory.

Auditing, reviewing or gating an existing project (code or CI): read `../recipes/packs/security.md` first. It holds the audit order and the report format.

## Threat model first (5 minutes)
1. **Trust boundaries.** Where does untrusted data enter? Requests, forms, uploads, webhooks, third-party APIs, queues, LLM output, and local values written by someone else (another process's arguments, shared filenames, job payloads). Trust follows who wrote the value, not the channel.
2. **Assets.** Credentials, personal data, payment data, admin actions, money movement.
3. **STRIDE per boundary.** Spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege.
4. **Abuse cases.** For each feature ask "how would I misuse this?" and make that your first test.

## Always
Validate input at the boundary with a schema. Parameterize queries. Encode output. Use HTTPS. Hash passwords (argon2, scrypt or bcrypt 12+). Secure cookies (httpOnly, secure, sameSite). Security headers. Authorize every request on the specific resource, not only authenticate. Run the package manager's audit before every release.

## Ask the user first
New auth flows or auth changes, new kinds of sensitive data, new external integrations, CORS changes, file uploads, rate-limit changes, elevated permissions.

## Never
Commit secrets. Log secrets or personal data. Trust client-side validation. Use `eval` or `innerHTML` on user data. Keep tokens in localStorage. Show stack traces to users. Omit security headers. Give an app broader OS, plugin or capability permissions than it needs (least privilege for desktop and mobile shells too).

## Specifics
- **Injection and XSS:** never build SQL or shell strings from input; use the framework's escaping or an allowlist sanitizer.
- **SSRF:** allowlist scheme and host, resolve DNS and reject private and loopback addresses, forbid redirects.
- **Destructive operations on derived paths:** before a delete, move or overwrite, resolve symlinks, require an allowlisted root, at least one level below it, and ownership evidence. On refusal, log and stop; never fall back to a broader path.
- **Uploads:** allowlist types, cap size, check content, not the extension.
- **Rate limits:** strict on auth endpoints; shared store when more than one instance.
- **Secrets:** from the environment; `.env.example` holds placeholders; real keys are gitignored; scan the staged diff. A leaked secret is compromised: rotate first, then clean history.
- **Dependencies:** one lockfile and a pinned manager; block install scripts until reviewed; triage audit findings by reachability; never auto-apply forced fixes; audits miss new malicious or typosquatted packages, so review new dependencies, release age and ownership.
- **Copying:** shipped code can be read. Keep value and secrets on the server; see `anti-copy.md`.
- **Personal data:** collect only for a stated purpose, classify fields, set retention, keep deletion and export working end to end.
- **AI/LLM features:** model output is untrusted (never into eval, SQL, shell, HTML or paths; validate then encode). Prompts can be hijacked by fetched text; enforce permissions in code, not in the prompt. Keep secrets and other users' data out of context. Confirm destructive tool actions. Cap tokens, rate and recursion.

## Tools (run as scripts, no tokens)
`python .pusula/checks/pusula_check.py --only sast,secrets,deps` runs Semgrep (`p/default`), gitleaks and osv-scanner. Read the report, then fix. They are a second opinion, not the audit: on a test with 19 planted flaws (Python, JS, C#) Semgrep flagged 15. It missed XML parsing of untrusted data, weak random for tokens, `innerHTML` with user data and an MD5 call in C#. Read the code for those, or run the language's own analyzer (Python: Bandit found the first two). A tool that could not run is "not checked", never "clean". Scan third-party skills with SkillSpector before installing.

## Check
Audit has no reachable critical or high findings. No secrets in code or history. Input validated at boundaries. Authorization on every protected route. Errors expose no internals. URL fetches allowlisted. Destructive paths guarded. LLM output validated. Personal data classified with retention.
