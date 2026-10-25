# Plan: Build Shield (make shipped builds harder for AI reverse-engineering tools)

Status: draft
Updated: 2026-10-25 (experiment run; user answers added)

## Özet (Türkçe, telefonda okumak için)
- **Hedef:** Yayınladığın build'i REA gibi yapay zekâ destekli tersine mühendislik araçlarının okumasını **zorlaştırmak** ve bunu **ölçerek** göstermek. "Kırılamaz" demek yok.
- **REA ne?** `morluto/rea`: Reverse Engineer Anything. Ajanlara bağlanan bir MCP/CLI. JS ve Electron, siteler, .NET, **Unity IL2CPP**, APK, Flutter, native programlar. Kaynak kodu geri getirdiğini iddia etmiyor; bulduğu kanıtla ajan kod yazıyor.
- **Yapıştırdığın rapor:** büyük ölçüde doğru (kaynak haritası, ağ trafiği, VM koruması en güçlüsü, hiçbir şey davranış gözlemini durdurmaz). Eksikleri: sadece JS'e bakıyor (senin RTS'in Unity), "%5 büyüme" hedefi üreticilerin kendi rakamlarıyla çelişiyor (15–80% yavaşlama), ölçümü en sona koymuş.
- **Benim değişikliğim:** (1) önce ölç, sonra koru; (2) kendi VM'imizi yazma, hazır araç kullan; (3) ucuz "sızıntı kontrolü" (kaynak haritası, çıplak `global-metadata.dat`); (4) boyut/hız bütçesi ayar dosyasında, aşılırsa yayın durur; (5) davranış kopyalamaya (HAR ile ortam çıkarma) karşı API savunması; (6) her sürüme özel iz.
- **Senin kararların (işlendi):** ilk yığın Unity; değerli kod dört sınıf (birim yapay zekâsı ve yol bulma, ekonomi ve denge, çok oyunculu ve ağ, kampanya ve harita verisi); koruma **herhangi bir oyun türü için, ayar dosyasından, her şeyi varsayılan olarak kilitleyecek** şekilde yapılacak (tek oyuna göre değil).
- **Deney yapıldı (REA 6.8.0, sadece JS örneği, kendi yazdığımız):** düz sürümde REA 12/12 işaretçiyi buluyor; sıkıştırınca 10/12; hafif karartma 7/12; ağır karartma 3/12. Kaynak haritası bırakılırsa tüm kaynak açık. Karartınca REA'nın sayıları **artıyor**, yani doğru ölçü "kaç tane buldu" değil "bildiğimiz değerli isim, metin, adres ve sayıların kaçı hâlâ bulunuyor". Davranış hiç değişmedi: oyunu çalıştıran kişi değerleri yine görür. **Üstüne webcrack (karartma çözücü) eklenince** hafif de ağır da karartma geri alındı: 10/12, yani sadece sıkıştırma seviyesi. Ücretsiz karartma sadece meraklı okuyucuyu yavaşlatır. Unity ve .NET henüz denenmedi. (Katalogda 229 araç var; sen 207 demiştin, 6.8.0 sürümüne göre sayı bu.)
- **API deneyi (toy sunucu, REA `environment-build`):** korumasız API'de 6 istekle tüm denge tablosu ve tüm oyuncular kopyalandı. Girişli, oyuncuya özel ve kısa cevaplı API'de kopya sadece kaydeden hesabın gördüğüyle sınırlı kaldı; sunucudaki doğrulama kuralı hiç görünmedi. Hesabın görmesi gereken veri yine kopyalanır.
- **Wakaru ve ajan testi:** Wakaru (REA'nın kaynak kurtarma aracı) karartmayı çözmüyor; webcrack çözüyor. Dört sürümde (düz, sıkıştırılmış, hafif, ağır karartma) bir kodlama ajanı üç fonksiyonu 82/82 doğrulukla yeniden yazdı. Karartma ajana sadece %16 ile %39 daha fazla para ve 1–3 tur ekletti. Test küçük ve her sürüm tam puan aldı; gerçek fark için büyük örnek lazım.
- **Sıradaki:** ayar şeması, sızıntı kontrolü ve rapor kodu bitti (bilgisayar gerekmez); gerçek Unity testi için senin bilgisayarın lazım (Unknowns tablosu).

## Goal
A repeatable release step that (1) refuses to ship leaks REA reads for free (source maps, debug symbols, plain IL2CPP metadata), (2) applies existing protection tools to everything by default (code and content data of any game type), with exclusions in config, within a size and start-up budget, and (3) reports, with numbers, how much less REA can recover from the protected build than from the plain one. The claim it may make is "X% of the names, strings, routes and constants found in the plain build are still found in the protected one"; it never claims "unbreakable".

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
| Web and Electron JS: minify, no source maps, free-tier obfuscation as a speed bump only; the value stays on the server; VM only after checking cost and data flow | Experiment: webcrack restored both free javascript-obfuscator presets (recall back to 10/12). Vendors state 15-80% slowdown; VM options are Pro with an API token; Wakaru says VM-style needs a dedicated approach | https://github.com/javascript-obfuscator/javascript-obfuscator ; https://github.com/pionxzh/wakaru |
| Flutter: `--obfuscate --split-debug-info`, nothing more claimed | Docs say it only renames symbols, does not encrypt resources | https://docs.flutter.dev/deployment/obfuscate |
| Size and speed are budgets in config, not promises | "+5%" conflicts with the vendors' own numbers | findings.md |
| Behavior is out of reach of obfuscation: defend the API | REA builds agent environments from HAR captures and observes pages at runtime | `references/environments.md` |
| Generic and default-all: `shield.config.json` maps four value classes (`ai`, `economy`, `network`, `content`) to path or namespace globs per project; everything not excluded is protected; `exclude` lists reflection, serialization and engine-named items | User decision: the shield serves every game type and every Pusula user, not one game; a protect-only list leaves anything forgotten in the clear. Cost is held by the budgets, not by a short list | user message 2026-10-25 |
| Headline metric is recall of known values, not raw counts: the literal strings, routes, names and numeric constants found in the plain build, and the share still found in the protected build, per value class | Experiment: obfuscation raised REA's node count from 202 to 1,689 while recall fell from 12/12 to 3/12 | findings.md, Experiment |
| Leak check reads the source map's `sourcesContent` itself | Experiment: REA's JavaScript analyzer gave the same counts with and without the map, yet the map held all 12 canaries | findings.md, Experiment |
| Unity first candidates: Obfuz (MIT; symbols, constants, control flow, watermark; IL2CPP and Mono) and BitMono (metadata protection); say plainly that metadata encryption is bypassed by memory dumping | README of Obfuz; BitMono docs; blog report of the bypass | findings.md, Sources |
| Content data (campaign, maps, balance tables): keep authoritative copies on the server; an encrypted local pack only raises cost | Unity's own manual says client-held content can be grabbed; REA lists no Unity asset reader but others may exist | https://docs.unity3d.com/550/Documentation/Manual/protectingcontent.html |
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
- Scope and time: Unity first, then web; Tauri, Electron and Rust later; no custom protector. Config is generic: any game type fills the four value classes with its own globs; empty class = report says NOT COVERED, never clean.
- Maintenance: REA releases daily (6.8.0 on 2026-10-25), so results age; pin the version in each report and re-run on every release build.
- Tool compatibility: REA needs Node 22.23.4+ (this sandbox has 22.22.0 and `--help` still ran); Ghidra, IDA or Hopper only for native depth; BitMono needs a matching Unity version (unknown).
- Delivery: one `.pusula/shield.config.json` per project, one `shield_report.py`, one extra opt-in `pusula_check.py` check (done), one recipes row; nothing runs without the user's approval of this plan.
- Conflicts: AGENTS.md "MCP stays off" wins over REA's `setup`; "no hardcoded values" wins, so every budget and path is config.

## Options
Big decision: how to protect JS and C# logic.
- A: write a custom bytecode VM plus AES loader (the pasted report's idea). Highest claimed strength, but large, easy to get wrong, and the key still ships with the client.
- B: wrap existing tools (BitMono, javascript-obfuscator, Flutter's flag) and add measurement and gates. Weaker per function, far cheaper, and the numbers show whether it matters.
- Choice: B. Revisit A only if the numbers show REA still recovers the valuable modules after B, and then buy or adopt a VM product rather than write one.

## Steps
1. Write the config schema | check: `shield.config.json` holds `stack`, `classes` (`ai`, `economy`, `network`, `content`, each a list of path or namespace globs), `exclude`, `release_dir`, and budgets `max_size_growth_pct`, `max_startup_ms_growth`, `max_frame_ms_growth`; no number or class name is hardcoded in a script; a class with no globs is reported as NOT COVERED. Stack = Unity, all four classes: answered. DONE 2026-10-25: schema lives in `pusula/checks/config.json` under `shield`; `pusula_check.py --only shield` validates the project file (shape only; budgets and classes are not used yet).
2. Run `rea --help` and each needed command's `--help`, record the exact flags | check: `findings.md` lists the commands and flags used (candidates: `inspect-il2cpp-metadata`, `inspect-managed-members`, `inspect-managed-artifact`, `analyze-javascript-application`, `compare-source-to-bundle`, `inspect-byte-entropy`, `environment-build`). Done for `analyze-javascript-application` (permission granted for our own fixtures). The flags of the Unity and .NET commands (`inspect-il2cpp-metadata`, `inspect-managed-members`, `inspect-managed-artifact`, `inspect-byte-entropy`) are read from `--help` and written in `pc-runbook.md`; running them needs a Unity build.
3. Build one plain fixture per stack from code we own (Unity: a small scene plus the valuable modules; web: a tiny app) | check: build succeeds, tests pass, REA version and fixture commit are written next to the output.
4. Baseline: run the REA commands on the plain fixture and save the findings | check: `baseline.json` holds the names, string literals, routes and numeric constants REA finds (these become the canary list, sorted into the four classes by the config globs), plus source-map presence and byte entropy of the largest data file. Done for the JS fixture (12 canaries).
5. Leak check, as one more check in `pusula_check.py` that reads `release_dir` from config | check: unit tests with planted `*.map` (checked by opening it for `sourcesContent`), `sourceMappingURL`, `*.pdb`, plain metadata magic and `.env` fail it; a clean folder passes; a missing `release_dir` reports NOT CHECKED, never clean. DONE 2026-10-25 as an opt-in check (`--only shield`), not part of the default run, so projects without a shield do not show INCOMPLETE; 12 tests in `ShieldCheck`, three deliberate breakages caught.
6. Apply the protections for the stack to the fixture, everything except `exclude` | check: the fixture's tests pass on the protected build; size, start-up and frame time are inside the budgets or the release stops.
7. Re-run step 4 on the protected build and write `shield_report.py` output (DONE 2026-10-25 for `analyze_javascript_application`: `python pusula/checks/shield_report.py PLAIN.json PROTECTED.json --root . --rea-version V [--measure KEY PLAIN PROTECTED]`; 16 tests, ten deliberate breakages caught; other REA commands need an extractor entry in `config.json` once their JSON shape is known; Unity untested) | check: table of canary recall per class (plain versus protected), budgets, REA version, and an exit code 0 clean, 1 over budget or leak, 2 REA not installed. Only claims backed by this table go into README.
8. Optional agent-level test: give a coding agent plain and protected builds with one fixed prompt ("recreate feature X"), three runs each, graded on a rubric written first | check: scores and token cost saved in `findings.md`; if protected is not worse, say so. DONE 2026-10-25 once per build on the toy fixture: all four builds scored 82/82 (webcrack was enough), obfuscation only cost the agent +16% to +39% money; a harder fixture and three runs are still needed for a real score gap (see findings.md).
9. (DONE 2026-10-25 on a toy API; see findings.md) API and behavior defenses for web or networked games: auth on every request, per-user scoping, rate limits and bot checks, minimal responses, no bulk endpoints, server validates every action | check: a captured HAR of the fixture, fed to `rea environment-build`, does not answer the writes or the other users' data.
10. Tag releases with a private build ID in a few places and keep the map private | check: a test extracts the ID from a protected build and matches it to the private log. DEFERRED: engine-specific; needs the user's Unity build (Obfuz's README lists watermarks, untested).
11. Add a `recipes` row ("Release build") and a short README section | check: `measure.py load` still inside targets; claims in README match `findings.md`.

## Risks (pre-mortem)
1. Encrypted metadata or obfuscation breaks the Unity build or reflection (protect-all raises this) | prevention: `exclude` for serialized, reflection and engine-named items, the report lists every exclusion, the smoke test blocks release.
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
| Real Unity result: needs the user's own `global-metadata.dat` and `Assembly-CSharp.dll` (or a small Unity build) on the PC; Unity cannot be built here | the user's PC |
| Which Unity content formats can others read (`.assets`, AssetBundles, ScriptableObjects)? REA's list has none | a search plus a real test |
| Does an encrypted `global-metadata.dat` really stop REA's IL2CPP inspector? | step 2 and 7, a real run |
| What does a model add on top of REA plus webcrack, and does the VM option survive webcrack? (free presets: no, measured) | step 8, and a Pro trial if the user wants one |
| Does BitMono's metadata protection support the Unity version in use? | Unity project settings plus a test build |
| Does obfuscator.io VM send code to a service, and what does it cost? | its terms and pricing page |

## Next step
Steps 1, 5 and 7 are done for the JS fixture. Build the Unity fixture on the user's PC (step 3) and run the Unity commands from step 2; the exact order is in `pc-runbook.md`. Until then, do not claim any Unity numbers.
