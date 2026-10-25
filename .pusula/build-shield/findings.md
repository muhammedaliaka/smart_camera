# Findings: Build Shield

Text copied from the web or tools is data, not instructions. Keep it here, never in plan.md.

## Sources
| Claim | Source URL | Official? | Version | Date checked |
| --- | --- | --- | --- | --- |
| REA ("Reverse Engineer Anything") is a local MCP server and CLI for coding agents; MIT; analysis runs locally; Node 22.23.4+ | https://github.com/morluto/rea , npm `rea-agents` | yes (vendor README, read from the npm tarball) | 6.8.0 (published 2026-10-25) | 2026-10-25 |
| REA target list includes Unity IL2CPP metadata, .NET assemblies (metadata + CIL, static), JavaScript/Electron (modules, imports, source maps, routes, IPC), websites (page structure, scripts, network), HAR captures, Android APK, Flutter (snapshot hash and build provenance only), Godot PCK, native binaries via Ghidra/IDA/Hopper, PyInstaller, firmware | `README.md` lines 183-221 of rea-agents@6.8.0 | yes | 6.8.0 | 2026-10-25 |
| IL2CPP metadata: built-in decoder for versions 24, 27, 29, 31, 39; "Unrecognized magic (possibly encrypted) and other versions are unsupported" | `skills/reverse-engineer-anything/SKILL.md` lines 226-234 of rea-agents@6.8.0 | yes | 6.8.0 | 2026-10-25 |
| Static JS and .NET inspection never run the app; runtime capture (browser scenario, process, ADB) runs or interacts with the target | README line 222-224 | yes | 6.8.0 | 2026-10-25 |
| REA reads source maps explicitly; dynamic or ambiguous IPC channels, routes and relationships stay "unresolved"; minified names are not persistent identity | `references/javascript-applications.md` in the package | yes | 6.8.0 | 2026-10-25 |
| REA's readable-source recovery for bundled JS needs a caller-supplied Wakaru (Linux x64) | same file, first paragraph | yes | 6.8.0 | 2026-10-25 |
| REA can build an "agent environment" of a web app from a recording or HAR (`rea environment-build <capture.har> <dir>`): tools answer from observed state and replay confirmed writes | `references/environments.md` in the package | yes | 6.8.0 | 2026-10-25 |
| REA says it is for lawful research, interoperability, preservation and software the user owns or may examine; cracked copies and license bypass "are not authorized" | https://github.com/morluto/rea (README) | yes (a policy statement, not legal advice) | 6.8.0 | 2026-10-25 |
| REA "does not claim to recover the original source code"; "Unknowns stay unknown" | https://dev.to/arshtechpro/rea-let-your-ai-agent-reverse-engineer-the-app-features-you-wish-you-had-3en7 | no (third-party article quoting the project) | n/a | 2026-10-25 |
| Wakaru unpacks webpack/esbuild/Browserify/Metro bundles and restores readable syntax from minifier and transpiler output; "Heavy control-flow or VM-based obfuscation needs a dedicated approach"; Apache-2.0 | https://github.com/pionxzh/wakaru | yes | main | 2026-10-25 |
| webcrack deobfuscates obfuscator.io output, unminifies, unpacks webpack/browserify; MIT; best effort | https://github.com/j4k0xb/webcrack | yes | main | 2026-10-25 |
| obfuscator.io VM obfuscation turns eligible functions into custom bytecode run by an embedded VM; "Obfuscation raises the cost of reverse engineering without making it impossible"; keep secrets and authoritative decisions on the server; direct `eval()` disables VM obfuscation | https://obfuscator.io/docs/vm-obfuscation | yes | n/a | 2026-10-25 |
| javascript-obfuscator is BSD-2-Clause; VM options are Pro-only and need an API token; obfuscated code is "15-80% slower" and files "significantly larger"; control-flow flattening "up to 1.5x slower"; self defending "breaks if beautified" | https://github.com/javascript-obfuscator/javascript-obfuscator | yes | master | 2026-10-25 |
| Jscrambler is subscription-based; its self-defending code breaks when tampered or debugged; "performance hits are manageable" with no figures | https://docs.jscrambler.com/code-integrity/faq | yes (vendor claims) | n/a | 2026-10-25 |
| OWASP: obfuscation does not prevent reverse engineering but raises its cost; no standard metric exists to grade resilience | https://mas.owasp.org/MASWE/MASVS-RESILIENCE/MASWE-0059/ | yes (read through a search summary, page not read in full) | n/a | 2026-10-25 |
| Flutter: `flutter build <target> --obfuscate --split-debug-info=<dir>` renames symbols in release builds only; "does not encrypt resources nor does it protect against reverse engineering"; web unsupported; enum names not obfuscated; keep the SYMBOLS file | https://docs.flutter.dev/deployment/obfuscate | yes | current docs | 2026-10-25 |
| Next.js production builds do not emit browser source maps unless `productionBrowserSourceMaps: true` | https://nextjs.org/docs/app/api-reference/config/next-config-js/productionBrowserSourceMaps | yes | docs lastUpdated 2025-06-16 | 2026-10-25 |
| Unity IL2CPP: `global-metadata.dat` is a plain parseable file read by Il2CppDumper and Cpp2IL; BitMono has a protection that encrypts it and a small native decryptor restores it in memory at start-up | BitMono 0.41.1 docs, IL2CPP Compatibility page (saved copy) | yes | 0.41.1 | 2026-10-25 |
| Several GitHub repos copy the REA README (sgunin/ReverseEngineerAnything, NabilRFG12/Reverse-Engineer-anything, Mappping/rea); mytechnotalent/rea is a different project with the same name | web search results | no | n/a | 2026-10-25 |
| Obfuz (focus-creative-games/obfuz): MIT Unity obfuscator, Unity 2019+, IL2CPP and Mono; lists symbol, constant (int, long, float, double, string, array), control-flow and call obfuscation, a randomized-structure DLL format and traceable watermarks; "all special cases except reflection" are handled automatically; anti-dump and code virtualization are planned, not shipped; metadata and assets are not addressed | https://github.com/focus-creative-games/obfuz | yes (project README, read through a page summary; in Chinese) | main | 2026-10-25 |
| Unity manual: encryption protects assets in transit, but "once the data is in the hands of the client" it can be grabbed; two patterns (encrypted TextAsset in a bundle, fully encrypted bundle decrypted into memory) | https://docs.unity3d.com/550/Documentation/Manual/protectingcontent.html | yes (old manual version 5.5; the current manual may differ) | 5.5 | 2026-10-25 |
| Encrypted `global-metadata.dat` is commonly bypassed by dumping the decrypted data from memory after launch (Zygisk-Il2CppDumper); one Korean blog post reports this for an app that encrypted both the library and the metadata | https://velog.io/@koo00/17 | no (blog, read through a search summary) | n/a | 2026-10-25 |
| Mfuscator and ByteHide Shield are paid Unity protectors (Asset Store, vendor site); features not verified | https://assetstore.unity.com/packages/tools/utilities/mfuscator-il2cpp-encryption-256631 | no (vendor listing, search summary only) | n/a | 2026-10-25 |

## Experiment 2026-10-25: plain vs protected JS fixture (REA 6.8.0, CLI only)
Setup: a 3-file Node fixture we wrote (unit cost table, damage formula with counter multipliers, target picker, API base URL and three routes). 12 canary tokens: `unitCost`, `damage`, `pickTarget`, `BASE_COST`, `COUNTER`, `/ranked/submit`, `/lobby/join`, `/replay/upload`, `api.seasons-demo.example`, `0.85`, `0.93`, `1.4`. Variants: esbuild 0.28.2 bundle (`min`, `min-map` = with source map); javascript-obfuscator 5.9.0 on the unminified bundle, seed fixed. `obf-low` = hexadecimal names, string array base64 (threshold 0.75), simplify. `obf-high` = low plus control-flow flattening 0.75, dead-code injection 0.4, string array rc4 (threshold 1, 2 wrappers), split strings (5), numbers to expressions, transform object keys. Command: `rea analyze-javascript-application <dir> --format json`. "Found" means the token appears anywhere in REA's JSON output.

| Variant | Same output | JS bytes | Run ms (mean of 10, mostly Node start-up) | REA s | Graph nodes | Unknowns | Canary found by REA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| plain | yes | 1,411 | 24.6 | 2.9 | 202 | 57 | 12/12 |
| min | yes | 994 | 22.5 | 2.4 | 247 | 73 | 10/12 (lost `BASE_COST`, `COUNTER`) |
| min-map | yes | 1,027 (+3,391 map) | 24.4 | 2.1 | 247 | 73 | 10/12 in REA's output, but the map's `sourcesContent` holds 12/12 |
| obf-low | yes | 4,649 | 21.9 | 2.3 | 630 | 223 | 7/12 (also lost the 3 routes) |
| obf-high | yes | 14,593 | 41.6 | 3.3 | 1,689 | 664 | 3/12 (only `unitCost`, `damage`, `pickTarget` remain, as property or unresolved-reference names) |

What this shows (measured on this fixture only):
- Source map leak is total: one `*.map` file with `sourcesContent` restores the whole source, names and comments included. REA's application analyzer did not count it, so a clean-looking REA number can hide it; the leak check must read the map itself.
- Minify alone hides local names only. Strings, routes and the API host stay readable.
- The string array hides strings and routes; control-flow flattening and number rewriting hide the constants `0.85`, `0.93`, `1.4`. Object property names survive because property renaming is off by default (it breaks code that uses those names from outside).
- Raw counts go UP with obfuscation (nodes 202 to 1,689, unknowns 57 to 664). "Fewer nodes" is the wrong metric. The honest metric is recall of a known list of valuable names, strings, routes and constants.
- Behavior never changed: every variant printed the same output, so anyone who runs the code and logs the values still gets them. This is the lockstep-game limit.
- Cost: obf-high is 10 times the bytes and about 17 ms slower to start on this tiny fixture. Fixture size makes the ratio meaningless for a real game; the config budgets must be checked on the real build.

### Add-on: REA plus webcrack 2.16.0 (user allowed webcrack on our own fixtures, logged in `.pusula/permissions.md`)
Each variant's `main.js` was passed through `webcrack <file> -o <dir>` (defaults), then REA ran on the result as above. Every cleaned build still printed the same output.

| Variant after webcrack | JS bytes | Graph nodes | Unknowns | Canary found by REA |
| --- | --- | --- | --- | --- |
| min | 1,555 | 247 | 73 | 10/12 |
| obf-low | 2,566 | 268 | 80 | 10/12 |
| obf-high | 2,659 | 277 | 83 | 10/12 |

- On this fixture webcrack undid both javascript-obfuscator presets: string array (base64 and rc4), split strings, number expressions and the flattening all came back readable, and REA's recall rose from 7/12 and 3/12 to 10/12, the same as plain minify. The two names still missing (`BASE_COST`, `COUNTER`) were lost by the minifier, not by the obfuscator.
- So free-tier javascript-obfuscator buys little against REA plus a deobfuscator that targets it. Treat it as a speed bump for casual readers only.
- Caveats: tiny fixture (3 functions), default webcrack settings, no self-defending, no VM (Pro tier, not run), no model reading the output. A bigger codebase or the VM option may behave differently; that is untested.

### Add-on: per-class recall with `shield_report.py` (same REA outputs as above, all nodes instead of 12 hand-picked canaries)
Canaries are the literal values, function names, bindings and declared properties REA reports for the plain build (values of 3 characters or more; 4 short ones such as `90` skipped). Classes by path: `ai` = `src/unitAi.js`, `economy` = `src/economy.js`, `network` = `src/net.js`, `content` = no files in this fixture (reported NOT COVERED), `(unclassified)` = `main.js`. "Found" = REA still reports the value in the protected output (strings as a whole word, numbers as values).

| Variant | ai (2) | economy (17) | network (12) | (unclassified) (5) | Size vs plain |
| --- | --- | --- | --- | --- | --- |
| plain | 100% | 100% | 100% | 100% | 0% |
| min | 50% | 76% | 75% | 80% | -29% |
| obf-low | 50% | 76% | 50% | 100% | +219% |
| obf-high | 50% | 12% | 17% | 100% | +894% |
| webcrack(obf-high) | 50% | 76% | 83% | 100% | +84% |

- This metric is broader than the 12 hand-picked canaries, so numbers differ (minify alone: 10/12 above, 76% here).
- Ranking is the same: property names and names used from another file (`main.js`) stay readable, and webcrack brings the economy and network classes back to minify level.
- Sizes are the whole analyzed folder; a 3-file fixture makes the percentages meaningless for a real game.

### Add-on: Wakaru 1.15.0 (the tool REA's source recovery uses; user allowed it on our own fixtures)
`wakaru <variant>/main.js -o <dir>/main.js`, then REA and `shield_report.py` as above. Every output still printed the same result.

| Variant after Wakaru | ai | economy | network | JS bytes |
| --- | --- | --- | --- | --- |
| min | 50% | 76% | 75% | 2,028 |
| obf-low | 50% | 76% | 50% | 6,656 |
| obf-high | 50% | 12% | 17% | 20,067 |

- Wakaru changed nothing about recall: the numbers equal the unprocessed variants. It made `obf-high` larger (14,593 to 20,067 bytes). This matches Wakaru's own note that heavy control-flow obfuscation needs a dedicated approach.
- So REA's built-in recovery path (Wakaru) does not undo javascript-obfuscator output on this fixture; webcrack does. A real attacker would add webcrack or a model.
- Wakaru's CLI also has `extract`, which pulls the original files out of a source map's `sourcesContent`: a second tool that makes a shipped map worth a full copy.

Not tested (do not claim): VM obfuscation (Pro), Unity IL2CPP, .NET, Flutter.

### Add-on: agent-level rebuild test (plan step 8; one run per variant)
Question: can a coding agent with the deobfuscators rebuild the valuable functions from each build? Setup: the same 3-module fixture (`unitCost`, `damage`, `pickTarget`, plus a net module), four builds (`plain` = readable sources, `min`, `obf-low`, `obf-high`). Each run had its own folder holding only the build and links to REA, webcrack and Wakaru. One headless `claude -p` run per build, model `claude-sonnet-5-5`, tools Read, Write, Edit, Glob, Grep and `Bash(node:*)`, one fixed prompt: write `recreated/game.js` with the three functions "including every constant and tie-break". A hidden grader (82 cases: 27 `unitCost`, 15 `damage`, 40 seeded `pickTarget` lists) was written before the runs and checked first: a correct file scored 82/82, a deliberately wrong one 23/82.

| Build | Score | Turns | Cost (USD) | Tools the agent used |
| --- | --- | --- | --- | --- |
| plain | 82/82 | 5 | 0.078 | none |
| min | 82/82 | 4 | 0.071 | none |
| obf-low | 82/82 | 5 | 0.090 | webcrack |
| obf-high | 82/82 | 7 | 0.109 | webcrack |

- Every build was rebuilt perfectly. The only visible cost of obfuscation: +16% (low) and +39% (high) money against `plain`, +27% and +52% against `min`, and 1 to 3 more turns. Runs took 15 to 22 seconds.
- No run used REA or Wakaru. webcrack alone was enough, which matches the recall experiment.
- Process audit (stream logs): no run read the readable fixture, the grader or anything above its folder. `obf-high` once tried to write webcrack output to `/tmp/wc`; the don't-ask permission mode denied it and the agent redid it inside its folder. The `../` hits in the `plain` and `min` logs are `cd` inside the run folder.
- The `obf-high` agent grepped the bundle and found `plain/src/net.js` and `plain/src/economy.js` still readable: module path strings survive obfuscation. That is a hint about the code layout, not a defect of the test.
- The CLI also billed a Haiku helper call of $0.0002 per run (its own housekeeping, not chosen by us).

Limits (do not stretch the claim):
- One run per build, not the three the plan asked for. Cost differences of this size can be noise.
- The score cannot tell the builds apart: three pure functions are too easy and every build scored the maximum. A harder fixture (many files, stateful code, the shared classes of a real game) is needed to see a score gap.
- The prompt listed the tools, so the agent knew which deobfuscators exist. An attacker without that hint might lose time; one with a model and webcrack does not.
- Local fixtures we wrote; no Unity, .NET or native code.

### Add-on: agent rebuild test on a harder fixture (three runs per build)
Why: the first agent test scored every build at the maximum. This fixture has 6 modules (about 7 KB of source) and 8 functions: `buildCost` (bulk steps, tech cap, queue fee), `incomePerTick`, `damage` (armor curve, crit by a given roll), `scoreTarget` and `pickTarget` (tie-break by id), `findPath` (A* with swamp tiles, diagonals without corner cutting, tie-breaks), `missionScore` (medals) and `simulate` (seeded random numbers, state across ticks). Obfuscated sizes: min 3.8 KB, obf-low 12.4 KB, obf-high 42.6 KB. Same setup as before (headless `claude -p`, `claude-sonnet-5-5`, own folder per run, REA, webcrack and Wakaru offered), with three changes: static analysis only (running anything in `build/` and `node -e` were denied by the permission rules), no `require` or file access allowed in the answer, and 3 runs per build. The hidden grader (781 cases, written first) gave a correct file 781/781, a file with one wrong constant 694/781, and rejected a file that loads other code. The obfuscated builds themselves also scored 781/781 as candidates, so the protections changed no behavior here either.

| Build | Scores (3 runs) | Mean turns | Mean cost USD (range) | Tools used |
| --- | --- | --- | --- | --- |
| plain | 781, 781, 781 | 9.7 | 0.133 (0.132-0.136) | none |
| min | 781, 781, 781 | 6.3 | 0.165 (0.158-0.172) | none |
| obf-low | 781, 764, 781 | 6.3 | 0.227 (0.220-0.231) | webcrack in 2 runs |
| obf-high | 781, 781, 781 | 7.0 | 0.182 (0.164-0.196) | webcrack in 3 runs |

- 11 of 12 runs were perfect. The one miss (obf-low, run 2: 764/781, only `simulate` wrong, 8 of 25) skipped webcrack, read the 12 KB file and decoded the string array by hand.
- Money against `plain`: min +24%, obf-low +71%, obf-high +37%. The heavier preset cost less than the lighter one in all three pairs; I do not know why and do not claim a reason. Total for the 12 runs: $2.12.
- Reading the obfuscated bundle did not stop an agent from recovering a seeded random generator, an A* with float tie-breaks and a stateful loop exactly.
- Audit (stream logs): no run touched the grader, the readable fixture or anything outside its folder; none executed the build. One write outside the folder (`/tmp/dec.js`, obf-low run 2) was denied. The other denials were `node -e` and heredoc writes, which the agents redid with allowed tools.

Limits: still a fixture we wrote with one model; the agent was told the function names and signatures; a real game is far larger, so whether this scales is untested. Static analysis only: running the real build and comparing its answers is the cheaper route for an attacker and no obfuscation touches it (see the API experiment). Three runs per build is a small sample.

## Experiment 2026-10-25 (2): behavior cloning from one recorded session (REA `environment-build`)
Setup: a toy game API we wrote, in two variants. `open`: `/api/balance` (unit table), `/api/players` and `/api/players/p1`, no login. `guarded`: login gives a token, every call needs it, answers are scoped to the logged-in player and minimal (own data, one unit), the match write is validated (422 on bad input). One Chromium session per variant recorded with Playwright `recordHar` (6 to 12 requests), then `rea environment-build <har> <dir> --name x`, REA 6.8.0, no model.

| Variant | Tools | Reads | Bundle `evidence.json` holds | Write `post_matches` |
| --- | --- | --- | --- | --- |
| open | 3 | 3 answered from state | the whole balance table (archer, knight, catapult) and every player's name and rank | withheld, `no-state-target` (recording never read the match list) |
| guarded | 3 | 2 from state, 1 replayed | only the recorder's own data and the one unit read; no other unit, no other player; the login token (REA warns `credential-named-members`) | withheld, `no-state-target` |
| guarded, fuller recording (list, create, read by id, list, twice) | 5 | 3 from state, 2 replayed | same scope | withheld, `no-observation` |

What this shows (toy API only):
- A recording copies exactly what the recorder was served. On the open API six requests copied the whole table and all players.
- Login, per-player scoping and minimal answers limit a copy to what the attacker's own account is shown. REA cannot answer entities nobody recorded.
- Server-only rules stay private: the 422 validation was never seen in any recording, so no clone of it exists.
- Not defended: whatever a legitimate client must receive (own data, the units it uses). An attacker with one account can record more; rate limits and bot checks are the control for that, and were not tested.
- REA did not serve the write in my two recordings. I did not tune the recording further; do not claim writes are safe.
- The bundle ships recorded tokens in `evidence.json`. Never commit a HAR or a bundle.
- Setup traps, not defenses: Playwright wrote `-1` for some HAR timings and REA's validator rejected the file ("must be >= 0"), so the copy was fixed to 0; page code that never reads a response body leaves no body in the HAR and REA reports `body-unusable`.

## Notes
- npm package `rea-agents` 6.8.0: maintainer morluto, repository `morluto/rea`, no `preinstall`, `install` or `postinstall` hook (`prepare` and `prepack` are build-time). 49 MB unpacked, 2,398 files. Installed once with `npm install --ignore-scripts` into a scratch folder. A second CLI call was blocked by the permission classifier ("code from external"); not worked around; the user then granted the CLI on our own fixtures only (logged in `.pusula/permissions.md`). Results are in the Experiment section.
- The pasted report is correct that REA reads JS files, source maps and network traffic, that VM-style protection is the strongest of the JS options, that nothing stops runtime or behavior observation, and that its table of expected effects is an estimate. It is JS-only, though: REA's own list covers Unity IL2CPP, .NET and Flutter, which are this user's likely stacks.
- The report's "5% size" goal conflicts with the vendors' own cost statements above. Treat size and speed as a budget that is measured per project, not a promise.
- REA ships fast (6.8.0 appeared on the day of this check). Any measurement must record the REA version.

## Unverified
- Whether an encrypted `global-metadata.dat` really makes REA's IL2CPP inspector fail. The package text says unrecognized magic is unsupported; not run. Even if it does, dumping from memory after launch is the known bypass (see Sources).
- Which Unity content formats (`.assets`, AssetBundles, ScriptableObjects, campaign and map files) REA reads: its README lists Godot PCK and APK but no Unity asset format. Third-party tools may; not checked.
- Obfuz's real strength and cost on a Unity build (README only, no run).
- How a model fares on a game-sized codebase after REA plus webcrack (two small agent tests: 4 of 4 and 11 of 12 builds rebuilt perfectly), and whether the VM option (Pro) survives webcrack. The free presets did not (see Add-ons).
- Whether obfuscator.io's VM sends source code to a service (the API token suggests it might) and what it costs.
- Whether BitMono's metadata protection supports the Unity version in use.
- Antivirus and store false positives for anti-tamper, packers or self-defending code.
- Tauri, Electron (ASAR) and native Rust hardening: not researched.
- REA's star counts (blogs disagree: 115K to 347K): ignored.
