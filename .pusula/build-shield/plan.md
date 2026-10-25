# Plan: Build Shield (make shipped builds harder for AI reverse-engineering tools)

Status: draft
Updated: 2026-10-25

## Özet (Türkçe, telefonda okumak için)
- **Hedef:** Yayınladığın build'i REA gibi yapay zekâ destekli tersine mühendislik araçlarının okumasını **zorlaştırmak** ve bunu **ölçerek** göstermek. "Kırılamaz" demek yok.
- **REA ne?** `morluto/rea`: Reverse Engineer Anything. Ajanlara bağlanan bir MCP/CLI. JS ve Electron, siteler, .NET, **Unity IL2CPP**, APK, Flutter, native programlar. Kaynak kodu geri getirdiğini iddia etmiyor; bulduğu kanıtla ajan kod yazıyor.
- **Yapıştırdığın rapor:** büyük ölçüde doğru (kaynak haritası, ağ trafiği, VM koruması en güçlüsü, hiçbir şey davranış gözlemini durdurmaz). Eksikleri: sadece JS'e bakıyor (senin RTS'in Unity), "%5 büyüme" hedefi üreticilerin kendi rakamlarıyla çelişiyor (15–80% yavaşlama), ölçümü en sona koymuş.
- **Benim değişikliğim:** (1) önce ölç, sonra koru; (2) kendi VM'imizi yazma, hazır araç kullan; (3) ucuz "sızıntı kontrolü" (kaynak haritası, çıplak `global-metadata.dat`); (4) boyut/hız bütçesi ayar dosyasında, aşılırsa yayın durur; (5) davranış kopyalamaya (HAR ile ortam çıkarma) karşı API savunması; (6) her sürüme özel iz.
- **Önce karar gereken:** hangi yığın ilk (öneri: Unity) ve hangi 5–10 modül "değerli" (sen söyleyeceksin). Detay aşağıda, İngilizce.

## Goal
A repeatable release step that (1) refuses to ship leaks REA reads for free (source maps, debug symbols, plain IL2CPP metadata), (2) applies existing protection tools to a user-chosen list of valuable modules within a size and start-up budget, and (3) reports, with numbers, how much less REA can recover from the protected build than from the plain one. The claim it may make is "recovers X% fewer names, strings and routes"; it never claims "unbreakable".

## Out of scope
- Making copying impossible, DRM, license servers, anti-piracy.
- Writing our own VM, packer or cipher.
- Traps aimed at the analyzing agent (prompt-injection text in binaries): unreliable, harms honest researchers, and careful agents treat text found in a target as data (reasoning, untested).
- Legal advice. Tauri, Electron and native Rust hardening (not researched yet).
- Using REA on anything the user does not own or may not examine.

## Decisions
| Decision | Reason | Official source |
| --- | --- | --- |
| Name the real tool: REA = `morluto/rea` (npm `rea-agents`), not ReVa | The user corrected the name; `mytechnotalent/rea` is a different project with the same name, and several repos copy the README | https://github.com/morluto/rea |
| Per-stack shield, Unity first | REA lists Unity IL2CPP, .NET and Flutter; the user's RTS is Unity; the pasted report covers JS only | README lines 183-221 (rea-agents 6.8.0) |
| Measure before protecting: baseline numbers from REA's own CLI, no model needed | OWASP notes there is no standard resilience metric; deterministic counts are repeatable and cheap | https://mas.owasp.org/MASWE/MASVS-RESILIENCE/MASWE-0059/ |
| Use REA through the CLI, never `npx rea-agents setup` | Pusula keeps MCP off; `setup` edits agent configs. The CLI offers the same workflows | README ("CLI commands use the same workflows") |
| Library first: no custom VM or AES loader | Rolling your own protector is a large, security-sensitive build; a measurement harness is the part nobody ships | Pusula `ponytail` rule |
| Leak check first: fail the release if `*.map`, `sourceMappingURL`, `*.pdb`, plain `global-metadata.dat` or `.env` sit in the output | REA reads source maps explicitly and decodes plain IL2CPP metadata; removing them is free | `javascript-applications.md` and IL2CPP section of the package; https://nextjs.org/docs/app/api-reference/config/next-config-js/productionBrowserSourceMaps |
| Unity: IL2CPP, strip, managed obfuscation before IL2CPP, and encrypt `global-metadata.dat` | REA decodes versions 24/27/29/31/39 and says unrecognized (possibly encrypted) magic is unsupported; BitMono documents such a protection | package SKILL.md lines 226-234; BitMono 0.41.1 docs |
| Web and Electron JS: minify, no source maps, obfuscate only the named modules, VM only after checking cost and data flow | Vendors state 15-80% slowdown; VM options are Pro with an API token; Wakaru says VM-style needs a dedicated approach | https://github.com/javascript-obfuscator/javascript-obfuscator ; https://github.com/pionxzh/wakaru |
| Flutter: `--obfuscate --split-debug-info`, nothing more claimed | Docs say it only renames symbols, does not encrypt resources | https://docs.flutter.dev/deployment/obfuscate |
| Size and speed are budgets in config, not promises | "+5%" conflicts with the vendors' own numbers | findings.md |
| Behavior is out of reach of obfuscation: defend the API | REA builds agent environments from HAR captures and observes pages at runtime | `references/environments.md` |
| Selective: protect a named list of modules, not the whole build | Cost and breakage grow with coverage; the report's own best idea | pasted report, section 3 |
| Tag every release with a private build ID | Lets the user prove where a leaked copy came from | common practice, untested |

## Coverage
Write one line per heading: decision, risk, unknown. Write "none" if empty.
- User experience: protected build must start and play as before; start-up and frame-time budgets live in config; anti-tamper that crashes the game is rejected.
- Correctness and logic: protected build must pass the same smoke tests as the plain one (step 6); renaming can break reflection, serialization and `Resources.Load` names in Unity.
- Security: this is cost-raising only; secrets and authority move to the server (decision 9); no secret ships in the client, encrypted or not.
- Cost and tokens: the baseline and report are scripts that call REA's CLI; no model tokens. The optional agent-level rebuild test (step 8) costs tokens and runs three times at most.
- Source quality: official docs and REA's own package text; third-party blogs only for the name collision; star counts ignored (blogs disagree).
- Tests: planted-leak unit tests for the leak check; budgets checked by script; equivalence smoke test; REA version recorded with every number.
- License and legal: REA MIT, Wakaru Apache-2.0, webcrack MIT, javascript-obfuscator BSD-2; obfuscator.io VM and Jscrambler are paid; EULA clause and takedown need a lawyer; REA's own README excludes unauthorized analysis.
- Scope and time: Unity first, then web; Tauri, Electron and Rust later; no custom protector.
- Maintenance: REA releases daily (6.8.0 on 2026-10-25), so results age; pin the version in each report and re-run on every release build.
- Tool compatibility: REA needs Node 22.23.4+ (this sandbox has 22.22.0 and `--help` still ran); Ghidra, IDA or Hopper only for native depth; BitMono needs a matching Unity version (unknown).
- Delivery: one `shield.config.json` per project, one `shield_report.py`, one extra `pusula_check.py` check, one recipes row; nothing runs without the user's approval of this plan.
- Conflicts: AGENTS.md "MCP stays off" wins over REA's `setup`; "no hardcoded values" wins, so every budget and path is config.

## Options
Big decision: how to protect JS and C# logic.
- A: write a custom bytecode VM plus AES loader (the pasted report's idea). Highest claimed strength, but large, easy to get wrong, and the key still ships with the client.
- B: wrap existing tools (BitMono, javascript-obfuscator, Flutter's flag) and add measurement and gates. Weaker per function, far cheaper, and the numbers show whether it matters.
- Choice: B. Revisit A only if the numbers show REA still recovers the valuable modules after B, and then buy or adopt a VM product rather than write one.

## Steps
1. Choose stack and valuables | check: `shield.config.json` exists with `stack`, `protect` (5 to 10 module or namespace names), `release_dir`, and budgets `max_size_growth_pct`, `max_startup_ms_growth`, `max_frame_ms_growth`; no number is hardcoded in a script. Needs the user's answers.
2. Run `rea --help` and each needed command's `--help`, record the exact flags | check: `findings.md` lists the commands and flags used (candidates: `inspect-il2cpp-metadata`, `inspect-managed-members`, `inspect-managed-artifact`, `analyze-javascript-application`, `compare-source-to-bundle`, `inspect-byte-entropy`, `environment-build`). Needs permission to run REA.
3. Build one plain fixture per stack from code we own (Unity: a small scene plus the valuable modules; web: a tiny app) | check: build succeeds, tests pass, REA version and fixture commit are written next to the output.
4. Baseline: run the REA commands on the plain fixture and save counts | check: `baseline.json` holds numbers for type and method names from metadata, string literals, routes and endpoints, module count, source-map presence, byte entropy of the largest data file.
5. Leak check, as one more check in `pusula_check.py` that reads `release_dir` from config | check: unit tests with planted `*.map`, `sourceMappingURL`, `*.pdb`, plain metadata magic and `.env` fail it; a clean folder passes; a missing `release_dir` reports NOT CHECKED, never clean.
6. Apply the protections for the stack to the fixture, selective by `protect` | check: the fixture's tests pass on the protected build; size, start-up and frame time are inside the budgets or the release stops.
7. Re-run step 4 on the protected build and write `shield_report.py` output | check: table of plain versus protected counts, percent change, budgets, REA version, and an exit code 0 clean, 1 over budget or leak, 2 REA not installed. Only claims backed by this table go into README.
8. Optional agent-level test: give a coding agent plain and protected builds with one fixed prompt ("recreate feature X"), three runs each, graded on a rubric written first | check: scores and token cost saved in `findings.md`; if protected is not worse, say so.
9. API and behavior defenses for web or networked games: auth on every request, per-user scoping, rate limits and bot checks, minimal responses, no bulk endpoints, server validates every action | check: a captured HAR of the fixture, fed to `rea environment-build`, does not answer the writes or the other users' data.
10. Tag releases with a private build ID in a few places and keep the map private | check: a test extracts the ID from a protected build and matches it to the private log.
11. Add a `recipes` row ("Release build") and a short README section | check: `measure.py load` still inside targets; claims in README match `findings.md`.

## Risks (pre-mortem)
1. Encrypted metadata or obfuscation breaks the Unity build or reflection | prevention: selective list, exclude serialized and reflection names, smoke test blocks release.
2. REA still reads the valuable logic from the native binary through Ghidra or IDA | prevention: measure it (step 4 and 7); say so in the report; move the logic to a server where the design allows.
3. A lockstep RTS must ship its simulation, so rules cannot be hidden | prevention: protect services, data and content; label this limit in the report.
4. Antivirus or store flags anti-tamper, packers or self-defending code | prevention: avoid self-defending and anti-debug by default; test on a clean Windows machine; keep it optional.
5. Size or speed regress past what players accept | prevention: budgets in config, gate in the script, measure on the weakest target device.
6. The REA numbers go stale, since REA ships daily | prevention: record the version, re-run on each release build.
7. Fake REA repos or npm look-alikes carry malware | prevention: only `morluto/rea` and `rea-agents` (maintainer morluto); install with `--ignore-scripts` in a scratch folder; never run `setup`.
8. Obfuscator.io VM or Jscrambler send source to a service or need a subscription | prevention: read their terms first; default to the free local tools.
9. False confidence: "protected" gets read as "safe" | prevention: reports say "recovers X% fewer", never "secure"; the "Do not promise unbreakable" line in `anti-copy.md` stays.
10. Build ID or watermark is stripped or lost | prevention: several places, private map committed to a private store, test after every build.

## Unknowns
| Question | Who or what answers it |
| --- | --- |
| Is `morluto/rea` the repo the user means? | the user (one word) |
| Which stack first, and which 5 to 10 modules are the valuable ones? | the user |
| Does an encrypted `global-metadata.dat` really stop REA's IL2CPP inspector? | step 2 and 7, a real run |
| Do javascript-obfuscator presets survive webcrack, and what does a model add? | step 7 and 8 |
| Does BitMono's metadata protection support the Unity version in use? | Unity project settings plus a test build |
| Does obfuscator.io VM send code to a service, and what does it cost? | its terms and pricing page |
| May REA's CLI be run in this sandbox? | the user (a permission rule), or run it on the PC |

## Next step
Get the user's answers to the first two unknowns and permission to run the REA CLI on fixtures we build ourselves; then do step 2.
