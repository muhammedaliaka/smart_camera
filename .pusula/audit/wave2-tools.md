# Wave 2 tools: codebase-memory-mcp and rtk (docs review 2026-10-25; static vetting incl. unity-agent-plugin 2026-10-26; nothing installed or run)

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

## Static vetting, 2026-10-26 (nothing installed, no binary or install script run)
Method: shallow clones in a scratch folder, pinned: unity-agent-plugin `3831ddb` (2026-10-23, plugin.json 0.1.8-beta), codebase-memory-mcp `8530c8c` (2026-10-26), rtk `e05c7bd` (2026-10-25). I read licenses, installers, hooks and flagged lines, and ran gitleaks, semgrep `p/default`, osv-scanner (rtk lockfile) and SkillSpector `--no-llm` (Unity plugin). I did not run any of the three tools: a binary run here would not be isolated from the session's network and credentials (isolation not verified), and the section above already says each trial needs a named yes.

### unity-agent-plugin (Unity Technologies)
- **License.** `LICENSE.md` points to the Unity Companion License v1.4, read on unity3d.com. Free, but only "in connection with the authoring and/or distribution of applications ... under a valid Unity ... Engine License" (1); no competitive analysis or competing product (1); your games are not derivative works (3.1); changes to the plugin itself are assigned to Unity (3.2); the license notice must travel with copies (5); ends on breach or a patent suit (8). So: install unmodified, never copy or trim its skills into Pusula (Pusula is engine-agnostic and its skills are MIT), keep its files out of the MIT game repository or list them in `THIRD_PARTY.md` with the notice. [official]
- **Contents.** 32 skills (501 KB of SKILL text; `unity-cli` alone 62 KB), 59 C# example files, no hooks, no shell scripts, no MCP config. One C# example calls `AssetDatabase.DeleteAsset` (a "don't do this" sample). [ran: grep]
- **Start cost.** 32 name+description listings are about 2,000 tokens (characters/4), more than Pusula's whole core (1,792). Install at project scope in the Unity project only, never in user scope. [reasoning on a measured size]
- **Pre-approved tools.** `unity-cli` (Bash), `new-unity-project` (Bash, Write, Edit), `unity-package-management` (Bash, Write, Edit), `create-2d-physics` (WebFetch, WebSearch) use `allowed-tools`. Claude Code docs: those tools run without a prompt for the turn that invokes the skill; deny and ask rules still override. Editing the frontmatter would create a derivative (UCL 3.2), so add `ask` rules for `git push`, `rm`, `curl`, `unity bug` instead. [official + reasoning]
- **Install command in a skill.** `unity-cli/SKILL.md:96` says `curl -fsSL https://unity.com/install.sh | bash`. Pusula never runs piped installers: download, read, then run. `unity bug --share-project` uploads a copy of the project to Unity: needs the user's explicit yes. [official + Pusula rule]
- **Unity CLI behaviour (its own docs).** One anonymous usage ping on every run even without analytics consent (`UNITY_NO_CLI_INVOKED_TELEMETRY=1` stops it); anonymous crash reports via Sentry (`UNITY_NO_CRASH_REPORT` stops them); `unity mcp` and running C# in a live Editor exist: powerful, keep MCP off until a task needs it. [official]
- **SkillSpector `--no-llm`, 32 skills.** 18 score 0; `unity-cli` 100 and `build-live-game` 82 (CRITICAL), `levelplay-unity-integration` 71, `migrate-birp-to-urp` 69, `implement-in-app-purchases` 57 (HIGH); tool verdict "DO NOT INSTALL" and recursion "partial". 156 findings; I read the line behind one finding of each type (11 lines): they are documentation text (keyring notes, SSH policy, a Facebook sign-in comment, a `curl ... | python3 -m json.tool` read, the install line above) or "referenced file not completely inspected" (parser span limits). I found nothing malicious in those lines; the other findings are unread. The scanner's verdict stands as "not cleared", not as "malicious". [ran + reasoning]
- **gitleaks.** 1 hit: a documentation example (`"jiraProjectConfigId": "REDACTED"`). [ran]
- **Verdict.** Usable later, at project scope, unmodified, with ask rules and the two telemetry variables set. The `unity` CLI is a separate binary and needs its own yes.

### rtk
- **Licenses.** Root `LICENSE` Apache-2.0. `engine/` and `proxy/`: BUSL-1.1, Additional Use Grant allows free production use including inside the `rtk` binary and `rtk-proxy` (not as a paid or hosted service); Change Date 2030-09-09 to Apache-2.0. Fine for personal use. [official]
- **Installer.** `install.sh` checks the SHA-256 from the same release's `checksums.txt` (integrity, not authenticity), refuses on mismatch and on unsafe archive paths; `RTK_SKIP_CHECKSUM=1` bypasses it. Documented as `curl | sh`: download and read first. [official]
- **Claude hook.** `hooks/claude/rtk-rewrite.sh` is a thin script that calls `rtk rewrite`; exit codes keep Claude Code's allow, deny and ask rules in charge. Needs `jq`. [official]
- **Dependencies.** osv-scanner on `Cargo.lock` at this commit: 15 advisories in 8 crates (quick-xml 0.37.5 twice at CVSS 7.5; lru 0.12.5; rustls 0.23.37 several; rustls-webpki; webpki-roots; crossbeam-epoch; paste; anyhow). Reachability not checked. [ran]
- **gitleaks.** 9 hits in test code, `SECURITY.md`, a benchmark cloud-init file and `aws_cmd.rs`; judged from file names, not opened. [ran]
- **Verdict.** Still the smaller surface. Use the `oss` edition; keep the proxy off. Trial needs the named yes below.

### codebase-memory-mcp
- **License.** MIT. The clone is 1.5 GB (1.3 GB vendored grammar data under `internal/cbm`, not scanned). [official]
- **Scans.** gitleaks: no leaks in `src`, `scripts`, `docs`, `install.sh`, `install.ps1`. semgrep `p/default` on `src`, `scripts`, `install.sh`: 3 warnings (`strtok` twice, one file-mode in a benchmark script); 81 files failed to parse, so coverage is partial. [ran]
- **Network.** `SECURITY.md`: local indexing and queries; the only external call is a best-effort update check to `api.github.com` through `curl` after MCP `initialize`; no telemetry. The README line "no network request of its own accord" needs that footnote. [official]
- **Installer.** Checksum mandatory; `--skip-config` skips agent configuration. Without it, it writes MCP entries for many clients and Claude Code hooks into `$HOME/.claude/hooks` (a search hook before `Grep|Glob|Bash` and a context hook after `Read`; the code comment says both are context-only and fail open, 5 s timeout). Hooks from two systems on the same events still need the T22/T23 test. [official + code comment]
- **Verdict.** Unchanged: only for a large repository (the RTS game), by archive plus checksum, `--skip-config`, project scope.

### Named yeses the user can give later (one line each)
1. "unity-agent-plugin'i Unity projesine proje kapsamında kur" (plugin only, unmodified).
2. "rtk-oss'u atılabilir klasörde dene".
3. "codebase-memory-mcp'yi atılabilir klasörde dene".
