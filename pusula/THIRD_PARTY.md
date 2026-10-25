# THIRD_PARTY

Every third-party idea or text in Pusula is listed here. Checked on 2026-10-22; later rows (find-skills, frontend-design, settings, anti-copy) on 2026-10-25.
Rule: trusted source, license recorded (any license is fine for personal use), read in full, commit pinned, trimmed, scanned, recorded.

## Sources

| Source (pinned commit) | License | Pusula file | What we did |
| --- | --- | --- | --- |
| [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) `2c606141936f1eeef17fa3043a72095b4765b9c2` | MIT (stated in README and SKILL.md; no LICENSE file; no copyright holder named) | `AGENTS.md` (Work, items 1, 3, 4) | Condensed the four principles into three short rules. Guidance derives from Andrej Karpathy's public remarks; the repo is not written or endorsed by him. |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) `09c434ab73ca43761c5d8b0c5d341926c2fba710` | MIT, (c) 2026 DietrichGebert | `skills/ponytail`, `AGENTS.md` (Work, item 2) | Trimmed. Dropped lite and ultra levels. Added a build-or-buy rung (library only if integration costs under half of writing it) and a plain-Turkish closing note. |
| [obra/superpowers](https://github.com/obra/superpowers) `2ce8aa15d05bd57213e6f746f953aafb7ded7a8b` | MIT, (c) 2025 Jesse Vincent | `skills/verification-before-completion`, `skills/systematic-debugging`, `skills/test-driven-development`, `skills/writing-plans` | Rewritten shorter. Verification: added static-analysis gate, UI screenshot gate, own-tests rule. TDD: limited to logic; "delete the code" replaced by a red-green proof. Debugging: dropped the extra technique files and example scripts. Plans: kept file map, task sizing, step contents, self-review; added labelled-code rule (`Why code:`, `Checked:`), Pusula coverage list, no subagent handoff. |
| [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) `aeac41d4d005999432bb7312f7ff06383a91d59d` | MIT, (c) 2025 Addy Osmani | `skills/source-driven-development`, `skills/interview-me`, `skills/doubt-driven-development`, `skills/security-and-hardening`, `skills/code-simplification` | Rewritten shorter. Source-driven: added migration mapping table and "not official" label. Interview: added question cap, UI reference rule, grants rule. Doubt: no subagent, same-session pass, cross-model only with user approval. Security: condensed, reference files left out, tool pointers added. Simplification: language examples dropped. |
| [OthmanAdi/planning-with-files](https://github.com/OthmanAdi/planning-with-files) `de837a95cc845b6341a6cbfd902a89a8190c568e` | MIT, (c) 2026 Ahmad Adi | `skills/state-files` | Idea only (plan, findings and progress files on disk). New short text and templates. Its hooks, scripts, gated mode and parallel-plan machinery are not used. |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) `a80e4c9d12d607631249d4d7d059f835d4b2f13a` | MIT, (c) 2026 Vercel, Inc. | `skills/find-skills` | Rewritten shorter. Kept: search with `npx skills find`, verify before recommending, present options. Changed: no `-g -y` auto-install; CLI version pinned to 1.7.4; telemetry off; local skills first; shallow clone, SkillSpector scan and full read before any install; MCP stays off. SkillSpector scored the unpinned `npx skills` (RP1); pinned it. |
| [sindresorhus/awesome](https://github.com/sindresorhus/awesome) (index of community lists; checked 2026-10-25, not pinned) | CC0-1.0 | `skills/source-driven-development` (one pointer) | Link only, nothing copied. The index is about 55,000 characters, so it is never loaded whole; one topic list is opened when needed. Community material: picks are labelled "not official". |
| [anthropics/skills](https://github.com/anthropics/skills) `dbd4588f9e1033efb41dad4bef2f7947c8993d44` | Apache-2.0 (`skills/frontend-design/LICENSE.txt`, copied with the skill) | `skills/frontend-design` | Installed unmodified (SKILL.md and LICENSE.txt). It teaches how to avoid templated, AI-looking pages. Loaded only for new UI or a new look; `recipes` says an existing design system wins. SkillSpector `--no-llm`: 13/100, SAFE, one AR2 hit on "Errors don't apologize", which is UI-copy advice (false positive). Exempt from the 1,100-token body target in `tests/targets.json` because it is not Pusula text. |
| [Next.js documentation](https://nextjs.org/docs) (official; pages dated 2026-07 to 2026-10, v16.4) | Documentation, not copied | `skills/architecture-standard/stacks.md` (Next.js section) | Facts restated in short form with links: project structure, CLI list, data-security guide, testing guide, agent docs. Commands run once on `create-next-app@16.4.3`: `npm run lint`, `next typegen && tsc --noEmit`, `next build` (all passed). |

## Reviewed, not installed (2026-10-25)

| Source | License | Why not |
| --- | --- | --- |
| [anthropics/skills](https://github.com/anthropics/skills) `webapp-testing` | Apache-2.0 | `ui-acceptance` already covers screenshots; its helper script starts servers. |
| anthropics/skills `mcp-builder` | Apache-2.0 | MCP stays off by default. |
| anthropics/skills `skill-creator` | Apache-2.0 | Only for writing skills; Claude Code already ships one. |
| anthropics/skills `claude-api` | Apache-2.0 | Claude Code already lists it; load it from there. |
| anthropics/skills `discernment-nudge` | Apache-2.0 | Appends follow-up questions to answers; conflicts with short replies and no forced gap-hunting. |
| anthropics/skills `docx`, `pdf`, `pptx`, `xlsx` | source-available, not open source (README) | License is not open; file-format work is rare in the projects Pusula serves. |
| anthropics/skills `canvas-design`, `theme-factory`, `brand-guidelines`, `algorithmic-art`, `slack-gif-creator`, `web-artifacts-builder`, `internal-comms`, `doc-coauthoring`, `academy-guide` | not checked one by one | Not needed for code projects. |
| [kepano/obsidian-skills](https://github.com/kepano/obsidian-skills) (obsidian-markdown, obsidian-bases, json-canvas, obsidian-cli, defuddle, knap) | MIT (stated in repo; not re-verified) | Only useful when the project is an Obsidian vault. Plain Markdown in `.pusula/` opens in Obsidian without any skill. |
| [cyberkaida/reverse-engineering-assistant](https://github.com/cyberkaida/reverse-engineering-assistant) (ReVa) | not checked | A reverse-engineering tool (Ghidra MCP server), not a defense. Read only to write `skills/security-and-hardening/anti-copy.md`. Never installed. |
| [BitMono](https://github.com/sunnamed434/BitMono) docs 0.41.1 | not checked | Unity obfuscator, named in `anti-copy.md` as an option. Not installed or run. Its docs are the source for the `global-metadata.dat` statements. |
| Obfuscar, Mfuscator, Asset Store obfuscators | not checked | Not fetched; named nowhere as a recommendation. |

## Settings templates (`settings/`)

Pusula's own text, no third-party copy. Facts come from the official Claude Code docs (permissions, hooks, settings, skills; read 2026-10-25) and Codex config docs (permission profiles, `:workspace_roots`). Behavior was run, not only read: Claude Code 2.1.310 asked or denied on locked paths and printed the reminder after `/compact`; Codex CLI 0.164.0 denied reads of locked paths in `codex sandbox`.

## Not taken, and why

- vercel-labs/skills `find-skills` step 6 (`npx skills add ... -g -y`): installs unscanned third-party instructions without asking.
- superpowers `using-superpowers`: "even a 1% chance, call a skill" starts process on trivial tasks.
- superpowers subagent skills (`subagent-driven-development`, `dispatching-parallel-agents`): single-model rule.
- superpowers `writing-plans` handoff: it offers subagent-driven execution; Pusula implements in the same session. The rest of the skill is adapted.
- planning-with-files hooks: shell hooks run on every tool call and inject plan text; too heavy and too much surface for the first install.
- caveman: telegraph style conflicts with plain explanations; its own page says "be concise" gives most of the gain.

## Scan results (NVIDIA SkillSpector v2.12.0, static mode, `--no-llm`)

Upstream originals, as published:

| Skill | Score | Verdict | Note |
| --- | --- | --- | --- |
| ponytail, interview-me, karpathy-guidelines, test-driven-development | 0 | SAFE | no findings |
| verification-before-completion | 7 | SAFE | 1 medium |
| code-simplification | 21 | CAUTION | the word "Remove" in a table read as self-modification; false positive |
| doubt-driven-development | 22 | CAUTION | example command that calls another model's CLI |
| source-driven-development | 47 | CAUTION | the skill quotes a prompt-injection phrase as something to ignore; false positive |
| systematic-debugging | 77 | DO_NOT_INSTALL | example script about keychains and identities, plus bundled helper files; benign teaching content, not vendored |
| security-and-hardening | 100 | DO_NOT_INSTALL | 21 findings: links to unscanned reference files, secret-handling and cloud-metadata examples, one phrase; benign teaching content, reference files not vendored |

Pusula versions, rescanned 2026-10-25: all 17 Pusula skills score 0 with no findings. 10 read CAUTION and 7 read SAFE; every CAUTION is the scanner failing to resolve a file the skill names (such as `.pusula/...`, which exists only in a project). Three skills had invalid YAML front matter (an unquoted `: ` in the description, scanner code `manifest_parse_error`); fixed, and `tests/test_settings.py` now fails if it comes back. `frontend-design` (not Pusula text): 13/100, SAFE. A zero score is not a proof of safety; the scan is static, it never runs a skill. `plain-explain`, `ui-acceptance` and `architecture-standard` are Pusula's own text, no third-party source (the last is a rewrite of the user's own NEXUS_ARCH_STANDARD v4).
Not scanned: planning-with-files (not vendored).

## Tools run by checks/ (not copied into the repo)

| Tool | Version tested | License | Used for |
| --- | --- | --- | --- |
| [Semgrep](https://github.com/semgrep/semgrep) | 1.182.1 | not verified here | hardcoded-value rules (`checks/semgrep/hardcode.yml`, Pusula's own) and the registry ruleset `p/default`, downloaded at run time and not copied here; metrics are off |
| [lizard](https://github.com/terryyin/lizard) | 1.24.2 | not verified here | function complexity limit (`complexity` check) |
| [gitleaks](https://github.com/gitleaks/gitleaks) | 8.30.1 | MIT | secret scan |
| [osv-scanner](https://github.com/google/osv-scanner) | 2.7.0 | Apache-2.0 | dependency vulnerabilities (sends package names and versions to osv.dev) |
| [skills CLI](https://github.com/vercel-labs/skills) (npm `skills`) | 1.7.4 | MIT | `find` only: searches the public skill directory (run through `npx skills@1.7.4`, telemetry off). Install is never run by Pusula |
| [SkillSpector](https://github.com/NVIDIA/SkillSpector) | 2.12.0 | Apache-2.0 | scan of third-party skills before install |

## License text

The MIT License applies to each source above, with the copyright holders named in the table.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
