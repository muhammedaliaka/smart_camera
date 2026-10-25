# Wave 2 tools: codebase-memory-mcp and rtk (docs-level review, nothing installed or run)

Türkçe özet: İki araç da işe yarar görünüyor ama ikisi de Pusula kurallarıyla çakışabilecek şeyler yapıyor. codebase-memory-mcp kodu bir bilgi grafiğine çevirir (MIT, yerelde çalışır, kurulum betiği ayar dosyalarına yazar). rtk komut çıktılarını kısaltır (CLI Apache-2.0; motor ve proxy kısmı BUSL-1.1). **rtk'nin proxy özelliği bazı çağrıları daha ucuz modele yönlendirebiliyor; bu, "tek model Sonnet 5.5" kuralımızı bozar, o yüzden kapalı kalmalı.** Hiçbirini kurmadım, çalıştırmadım. Kurmadan önce senin "evet"in, tarama ve yan etki testi gerekiyor. Aşağıda ne okudum, neyi test edeceğim yazıyor.

Read on 2026-10-25 from the two GitHub README pages (first 100,000 characters of the codebase-memory-mcp page; the rest not read). Labels: [official] README text, [author] claim by the tool's own authors, [reasoning] my inference, [unverified].

## codebase-memory-mcp (DeusData/codebase-memory-mcp)
**What it is.** An MCP server that parses a repository with tree-sitter into a persistent code graph (functions, classes, call paths) and answers queries instead of the agent reading files one by one. 17 MCP tools per the page (`get_architecture`, `search_graph`, `search_code`, `trace_path`, `detect_changes`, `index_repository` and others); 162 vendored tree-sitter grammars; type resolution for Python, TS/JS, PHP, C#, Go, C, C++, Java, Kotlin, Rust, Perl. [official]
**License and integrity.** MIT. Releases carry SHA-256 `checksums.txt`; badges for VirusTotal, OpenSSF Scorecard and SLSA 3. Windows build is unsigned and Defender may flag it (the project calls it a false positive). [official]
**Cost claim.** "10x lower token use and 2.1x fewer tool calls" from the authors' 31-repository preprint (arXiv 2603.27277); the page says it covers the study's workloads and agent setup. Search summaries quote 99% and 120x: ignore those. Not independently checked. [author]
**Privacy.** "Makes no network request of its own accord", no telemetry; a local daemon, optional UI on 127.0.0.1:9749. Optional browser AI model downloads from Hugging Face only after opt-in. Index lives in `~/.cache/codebase-memory-mcp/`. [official]

**Conflicts with Pusula**
1. The installer writes MCP entries into about 45 client config files (for example `~/.claude.json`), instructions and skills (Codex `AGENTS.md` pointer), three agent profiles (Scout, Verify, Auditor), and session, compaction and search/read hooks. Pusula rules: MCP off by default, skills only after a SkillSpector scan, one model and no subagents (agent profiles), and our own `SessionStart:compact` hook (`after_compact.py`) plus `lock_guard.py`. Hooks from two systems on the same events need a test. [reasoning]
2. The documented install is `curl ... | bash`. Pusula never runs piped installers. Use the release archive, check `checksums.txt`, run only the binary. The page offers `--skip-config` (binary only). [official + reasoning]
3. 17 tool schemas add start-up tokens if loaded eagerly; Claude Code can defer MCP tool definitions. Must be measured (T7 method), not assumed. [reasoning]

**Fit.** Large code bases where the agent burns tokens on file-by-file exploration (the RTS game repository once the PC is back). Little value in a 20-file project. [reasoning]

**Test plan (needs the user's yes first)**
- Throwaway clone of a mid-size repo. Install by archive plus checksum with `--skip-config`, then add the MCP entry by hand in project scope only. Log the grant in `.pusula/permissions.md`.
- SkillSpector scan of anything it would install as a skill or agent profile.
- A/B on 3 questions with known answers (for example "who calls X", "what breaks if I rename Y", "where is Z configured"): answer correct or not, tool calls, tokens, cost. Same model and effort.
- T7: start-up tokens with and without the MCP entry.
- T22/T23: lock guard and compaction hook still work with the tool installed.
- Pass rule (proposed, the user may change it): correct answers in at least as many cases, and a clear token or call reduction on a repo of the user's size. Otherwise uninstall (`codebase-memory-mcp uninstall`; indexes stay unless deleted).

## rtk (rtk-ai/rtk)
**What it is.** A CLI proxy that filters and compresses shell command output (git, ls, cat, grep, test runners, docker ps and more) before it reaches the model. A PreToolUse hook rewrites a Bash call such as `git status` to `rtk git status`; `rtk bypass <cmd>` runs one command unfiltered. Hooks for Claude Code, Codex, Cursor, Gemini CLI and others. [official]
**License.** The `rtk` CLI is Apache-2.0. `engine/` and `proxy/` are BUSL-1.1 (source-available; engine use inside the binary is granted). An `rtk-oss` edition is Apache-only (`RTK_EDITION=oss` or `brew install rtk-ai/tap/rtk-oss`). Pusula accepts any license for personal use, but BUSL parts are not open source. Another crates.io package is also called `rtk`: `rtk gain` must show the savings dashboard. Both editions install a binary named `rtk`. [official]
**Cost claim.** "60-90% on common dev commands", and "about 150,000 tokens without rtk and about 45,000 with it" for a 30-minute session; the README says this is bash output only, estimated as bytes/4 with no tokenizer, and dilutes across the whole bill. [author]
**Telemetry.** Off until `rtk telemetry enable`. No command or file content collected, per the page. [official]

**Conflicts with Pusula**
1. **The optional proxy daemon sits between the agent and the model API, can route some calls to cheaper models and align cache breakpoints.** That breaks "one model" and exposes every prompt to a local daemon. Keep it off; use the `oss` edition so the proxy is not installed at all. [official + reasoning]
2. Output filtering can hide what `verification-before-completion` needs: full failing-test output and warnings. Evidence runs must use `rtk bypass` or the plain command. Must be tested with T5 (planted bug). [reasoning]
3. Our `lock_guard.py` is also a PreToolUse hook on Bash. rtk rewrites the command text before or after it runs, depending on hook order. A rewritten `cat package-lock.json` must still hit the read-lock (T22). Built-in Read, Grep and Glob are not rewritten (the README says so), which matches our existing known gap. [reasoning]
4. `rtk init -g` writes hooks and, for Codex and others, instruction files. Use `--dry-run` first and review the diff. [official]

**Fit.** Sessions heavy on `git`, `npm test`, `cargo test`, `docker` output. Little value for sessions that mostly read and write files. [reasoning]

**Test plan (needs the user's yes first)**
- Install the OSS edition by pinned release or a reviewed build, in a throwaway container or clone. `rtk init -g --dry-run`, read the diff, then init.
- T7 `measure.py real`: tokens and cost of a fixed task list (run tests, read git log, search) with and without it. Report real cost, not rtk's own estimate.
- T5 with filtering on: does the agent still report the planted failure by name and show proof?
- T22: lock guard still asks for `cat package-lock.json`, `grep integrity package-lock.json`.
- Pass rule (proposed, the user may change it): at least 30% lower total cost on the command-heavy task list, with T5 and T22 unchanged. Otherwise uninstall.

## Decision for the user
- Install neither now. When the PC is back, pick one for a trial, starting with rtk (smaller surface) if sessions are command-heavy, or codebase-memory-mcp if the pain is exploring a big repository.
- Both need a named yes: "install codebase-memory-mcp in a throwaway clone" or "install rtk-oss in a throwaway clone".
