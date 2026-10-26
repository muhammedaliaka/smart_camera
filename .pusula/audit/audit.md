# Pusula master audit (2026-10-25)

Scope: everything the user asked for in 51 messages, what exists now, what is missing, what is wrong, what waits for the user's PC. Written without asking the user anything (they said: finish everything, report at the end; unanswered questions use my recommendations). Labels: **Doğrulandı** (ran or measured in this repo), **Resmi kaynak** (read on the vendor page), **Tahmin** (my inference), **Bakmadım** (not looked at).

## Özet (düz Türkçe)

**Ne istedin?** Claude Code ve Codex için küçük, ucuz, her projeye uyan bir sistem: kurallar, skill'ler, alan paketleri ve makine kontrolleri. Yapay zekâ kaynağı önce resmi yerden okusun, eksik düşünmesin, kod yazmakta tembel olsun ama kontrolde tembel olmasın, izinlerini unutmasın, sade Türkçe konuşsun. Oyun için de (RTS) asset listesi, optimizasyon ve kopyalamaya karşı koruma istedin.

**Ne var?** 18 skill, 13 alan paketi, 8 makine kontrolü, 2 hook, ayar şablonları, 29 satırlık test tablosu, 106 birim test (7'si ağ, node ya da araç ister, atlanır). Başlangıç yükü 1.792 jeton (hedef 1.800). Çekirdek kural 920 jeton. Hepsi `pusula/` klasöründe.

**Bu turda bulduğum ve düzelttiğim şeyler**
1. Yönlendirici hiç çalışmıyordu: model `Skill` aracını hiç çağırmadı (15 koşunun 0'ı). Paketler yazılmıştı ama kimse okumuyordu. `AGENTS.md`'ye tek cümlelik işaretçi koydum; sonra beklenen paket 12 koşunun 11'inde okundu (Doğrulandı).
2. Paketler gerçekten yardım ediyor mu? **Sadece modelin ezberinde yanlış olan yerde.** Steam fiyat planında 6,3 → 9,0 puan. AI lisansı ve Next.js güvenliğinde fark yok: model zaten biliyor. Önceden yazdığım kurallar tutmadı; sonucu "başarısız" diye yazdım (`tests/results/2026-10-25b.md`). Üç paket daha (Tauri, RTS oyun üretimi, Unity) için üçüncü tur: kurallar tuttu (Tauri planı 6,0 → 8,3; RTS ağ planı 4,0 → 8,7; Unity menü planı 3,0 → 6,0), ama maliyet 2,4 kat ve kanıt zayıf: maddeleri paket metninden ben türettim, hangi cevabın hangi arm olduğu içerikten belliydi (`tests/results/2026-10-25c.md`). Ham veri `tests/results/data/` altında.
3. İzin defterinde esbuild ve javascript-obfuscator satırı eksikti. Sen "evet" demiştin; satırı ekledim.
4. Kendi kontrol betiğim kendi test kodumda hata verdi (karmaşıklık). Düzelttim.
5. Windows yolları (`type apps\web\yarn.lock`, PowerShell) için kilit testi yoktu. Eklendi; bilerek bozunca test kırmızı oldu (Doğrulandı).
6. AI üretim paketine animasyon (Mixamo), doku (Poly Haven, ambientCG), video (Wan, HunyuanVideo), Google Flow Music ve ElevenLabs SFX satırları eklendi. Google ve Mixamo'nun resmi sayfasına ulaşamadım; o satırlar etiketli.
7. Açık kalan `[unverified]` paket maddelerini resmi sayfalardan kapattım (Steam fragman biçimi, Flutter/Dart sürümü, Unity `.meta` ve sahne dosyaları, Türkiye 6563 sayılı kanun, itch.io/Apple/Google komisyonları). **Kendi paketimde hata buldum:** ACE-Step 1.5 lisansı MIT, ben Apache-2.0 yazmıştım; ham LICENSE dosyasından düzelttim (Doğrulandı). Epic'in sayfaları 403 veriyor: Unreal telif oranı ikincil kaynaktan, etiketli.
8. Tur 4 (Flutter, Unreal, pazarlama, güvenlik, Steam fragmanı, video izleme): ön kayıtlı üç kural tuttu, B her soruda A'ya eşit ya da yüksek (5 soruda en az 1 puan), maliyet 1,88 kat. Fark en çok ezberin zayıf olduğu yerde: Steam fragmanında A "en az 1080p, 1440p olur" dedi, resmi sayfa en çok 1920x1080 diyor. Güvenlikte B paketi hiç okumadı (beceri pakete işaret etmiyordu); işaret ekledim, paket okundu ama puan değişmedi. Unreal ve güvenlikte paket metninde olup uygulanmayan maddeler var (`tests/results/2026-10-26.md`).

**Hâlâ eksik (PC gerekmeyen ama yapamadığım)**
- Gerçek bir etkileşimli oturumda hiçbir skill denenmedi. Başsız denemeler var, canlı oturum yok.
- Codex'te işaretçi ve paket okuma denenmedi (bu makinede Codex yok).
- 13 paketin 13'ü ajan testine girdi (tur 1–4, n=3, kanıt zayıf). Tur 4'te güvenlik paketi hiç okunmadı; yönlendirme satırı eklendi, puan değişmedi (`results/2026-10-26.md`).
- Paketlerdeki bilgi, benim resmi sayfalardan okumama dayanıyor. Üç ayda bir tazelemek gerekiyor; bunu hatırlatan bir otomasyon yok (INDEX'te cümle var).

**Senin kararların (ben yapmadım, çünkü dışa dönük ya da geri dönüşsüz)**
1. Pusula ayrı, özel bir GitHub deposuna taşınsın mı? Şu an `smart_camera` içinde duruyor; o depo başka bir proje.
2. Unity'nin resmi eklentisi (`unity-agent-plugin`) kurulsun mu? Lisansı ("Unity Companion License") okunmadı; kurmak için senin evetin ve PC lazım.
3. `codebase-memory-mcp` ve `rtk` bir deneme klasöründe denensin mi? Sadece belgelerini okudum (`wave2-tools.md`).
4. Ticari oyun için lisans filtresi (`license_allow`) açık kalsın mı? Şimdi kapalı.
5. Tripo, Google Flow Music, ElevenLabs ses/atıf kuralları ve Unreal telif/sayfaları için bir hukuk ya da hesap sayfası açmam gerekirse onay ver.

**PC gelince** (`.pusula/build-shield/pc-runbook.md` içinde sırayla): Unity release build ile REA ölçümü, Unity çıkarıcı satırı, `/context` rakamı, "yapma"nın cazip anda tutulması (T24), gerçek oturumda skill tetiklenmesi.

---

## 1. Every ask → status

Status: **Done** (built and checked), **Partial**, **Chat only** (answered in chat, no file), **Parked** (user redirected), **Needs PC**.

| # | Ask (message) | Status | Evidence | Gap | Next |
| --- | --- | --- | --- | --- | --- |
| 1 | EVREN / H200 / Matrix-Game for an RTS, Claude Code + MCP + WebSocket test (m0-2) | Parked | Chat only. User redirected: "mcp değil, önemli olan hangi araçları seçeceğimiz" (m3) | EVREN terms unknown: the platform bot would not answer; API serves only models deployed there (user's paste, m2); user holds 1030 CR at 10 CR per GPU-hour | User asks the EVREN guide page; Pusula does not depend on it. **Bakmadım** |
| 2 | Commercial-safe AI tool per lane, attribution, AI SFX state (m3-4) | Done | `ai-production.md`: 3D, image, music, SFX, voice, rig, texture, video lanes with licenses read on vendor pages; Steam disclosure; credit placement | Google Flow Music terms not found (labeled); Tripo 403; Mixamo from a search summary; ElevenLabs voice credit rules | Re-read on the day of use; pack says so |
| 3 | Full RTS asset and optimization list, explained simply (m5-6) | Partial | `game-production.md`: user's asset list grouped, optimizations with only vendor-doc facts, rest labeled "not read in vendor docs" | The one-by-one plain explanation was chat only; unread optimizations (flow fields, spatial hash, mip streaming) | Optional pack extension; no vendor claim without a page |
| 4 | Fix "one-sided thinking": 12 headings, questions, pre-mortem, two plans, separate review, a test per plan item, plan in a file (m6-7) | Done, two deliberate deviations | `writing-plans`, `state-files/templates/plan.md` (12-line Coverage, Options, Steps with checks, 10-line pre-mortem), `pusula_check` plan check, `game-production.md` scope list (the user's 11 headings plus one) | "15 questions before the plan" became `interview-me` (one question with a guess; if the user cannot answer, assumptions are written down). "4-6 fresh sessions with roles" is not default (one model, no subagents); the user can ask for a workflow | Keep; both follow the user's later rules (m9) |
| 5 | Why seniors get better AI results (m5) | Chat only | Embodied in core rules: think first, official sources, evidence before "done" | None needed | none |
| 6 | Famous seniors' skills, generic library, low token, RAG/KAG question (m7-8, 15) | Done | Plan Doc option A vs B (small core + tiered skills vs search layer); adopted skills from addyosmani, obra, karpathy, ponytail with `THIRD_PARTY.md`; 18 skills, 13 packs, routing measured | KAG (graph retrieval) not evaluated beyond `codebase-memory-mcp` docs; the 100-skill threshold for option B is not reached | Revisit only if routing fails above ~100 skills |
| 7 | Scope: AI production, Tauri/Rust, Flutter, Next.js, three.js/GLB, Unity, Unreal, security, planning, marketing, sales, video making and watching (m8) | Done | 13 packs + INDEX; structure tests (`test_packs.py`) | All 13 packs have agent tests (rounds 1-4, n=3, weak evidence); round 4 found a routing gap for `security.md` (fixed) and "read but not applied" items in Unreal and security | Real use on the PC decides |
| 8 | STE-100-like plain talk, AI finds its own gaps, not lazy/overthinking, little code (m8-9) | Done | `AGENTS.md` (Talking, Work 1-4), `plain-explain`, `ponytail`; A/B T6, T16 | "Not lazy and not overthinking" is a balance; only measured by cost (B about 1.3-2x A) | none |
| 9 | Static-analysis verification, not only own tests (m9) | Done | `verification-before-completion`, `pusula_check.py` (sast via Semgrep `p/default`, complexity, secrets, deps); T5, T14 | Semgrep rules download needs internet; offline reports NOT CHECKED, exit 2 | none |
| 10 | Honor given permissions, remember "never" (m9, 36) | Done, one ledger fix | `AGENTS.md` Permissions, `.pusula/permissions.md`, `after_compact.py`; T4b, T23 | Ledger lacked the esbuild/javascript-obfuscator row (fixed in this audit). T24 (will the model keep a "never" at a tempting moment) is unproven | Real session test (PC) |
| 11 | Single model, no subagents, MCP off (m9) | Done | `AGENTS.md` Cost; settings template; no MCP in Pusula | none | none |
| 12 | Zero hardcode, files <= 30 KB, UI/UX standards (m9) | Done | `pusula_check` size + hardcode (Semgrep rules for C#, TS/JS, Dart, Rust, Python); `ui-acceptance`, `frontend-design`; T21 | Hardcode rules are generic; no Unity UXML/USS-specific rule | PC: run on the real Unity project |
| 13 | No unreasoned code in plans (m9, 17) | Done | `writing-plans`: `Why code:` / `Checked:` labels; plan check scans unlabeled code blocks | none | none |
| 14 | UI that fits what the user means (Unity main menu failures) (m9) | Partial | `ui-acceptance`, `unity.md` UI section, round 3 probe p8: B plans wrote acceptance criteria first and asked for per-state screenshots (3/3); A plans did not (0/3); both said "not run in Unity" | Never run in Unity; real screenshots need the editor; B never wrote the `-runTests` flags the pack lists (0/3) | PC: T3 real run |
| 15 | NEXUS refresh (m26) | Done | `NEXUS_v5.md` (19 rules to 9), `architecture-standard`; T15-T18 | Unity asmdef and Flutter layering untried | PC / a Flutter project |
| 16 | Generic, any license OK with credit, no Blender-style MCPs, find-skills (m32-33) | Done | `find-skills` (pinned CLI, telemetry off, no install without scan and yes), `THIRD_PARTY.md`; T19 | none | none |
| 17 | `sindresorhus/awesome` as "scope" (m33) | Done (as pointer) | `architecture-standard/stacks.md` points to it; never loaded whole | The user's follow-up question ("what do you mean by package") was answered in chat | none |
| 18 | Read-lock for lock/build files (m36) | Done | `settings/claude.settings.json` ask rules, `lock_guard.py`, Codex deny profile; T22; Windows/PowerShell path tests added in this audit | `grep -r x .` bypasses the hook (stated limit); Windows hook never run on Windows | PC: one real Windows run |
| 19 | Context compaction, limit-saving tips (m36) | Done | `after_compact.py`, `autoCompactWindow`, README "Limiti geç bitirmek"; T23; measured +2,521 tokens, template gives back about 2,100 | Real `/context` figure in a live session | PC |
| 20 | Anthropic's skills, Obsidian (m36) | Done | `frontend-design` installed (SkillSpector 13/100); README Obsidian section | none | none |
| 21 | "yapma" persistence (m36) | Partial | Never-lines in `permissions.md` + reminder hook | T24 unproven (needs a real long session) | PC |
| 22 | REA defense: plan, research, own ideas (m36, 38-39) | Done for JS, Needs PC for Unity | `.pusula/build-shield/plan.md`, `findings.md`, leak check `--only shield`, `shield_report.py`; REA/webcrack/Wakaru/esbuild/obfuscator on our fixtures; agent rewrite tests (82/82; 11/12) | No Unity number exists; content formats (.assets, bundles) unread | `pc-runbook.md` |
| 23 | Write `shield_report.py` (m41) | Done | `checks/shield_report.py`, 16 tests, 10 deliberate breaks tried (2 slipped first, tests added) | Unity extractor entry missing (shape unknown) | PC |
| 24 | Do what needs no PC; analyze; improve (m23, 50) | Done | Tests T1-T29, A/B rounds 1-4, packs, this audit | See sections 2-3 | none |
| 25 | Memory graph tools (m15) | Parked | `.pusula/audit/wave2-tools.md` (docs only; nothing installed) | Not run: running unvetted external tools needs the user's yes | Decision 3 |
| 26 | Voice-over in EU4/AoE (m7 side question) | Chat only | `game-production.md` lists voice barks and announcer as an asset class | No fact pack on RTS voice conventions | none |

## 2. Problems found in this audit

| ID | Problem | Severity | Action |
| --- | --- | --- | --- |
| P1 | Router never fired (0/15 `Skill` calls); packs found only by chance (4/12) | High | Fixed: pointer in `AGENTS.md`; 11/12 afterwards |
| P2 | A/B round 1 and 2 fail the pre-registered rules R1, R2; round 3 passes R5-R7 | Medium | Reported as fail and pass as measured; packs kept because gains sit where the model is wrong (Steam rules, `gltf-validator` has no CLI, Tauri updater key, lockstep details) |
| P12 | Round 3 is weak evidence: rubric derived from pack text, arms recognizable from content, cost 2.4x | Medium | Stated in the results file; real test is T1 and T3 on the PC |
| P13 | Running `pusula_check.py` at the repo root fails on the unrelated camera project (`analyze_video_v2.py` 45 KB and complexity up to 31; `setup_wizard_modern.py` size and a URL) | Low (not Pusula) | Not touched; Pusula is checked with `--root pusula` |
| P3 | `permissions.md` lacked the esbuild/obfuscator row | Medium (breaks our own rule) | Fixed |
| P4 | Plan Doc (rev 154) outdated: says "write eight protocols", "T1-T7", lists "7 files per folder" rule that was removed, no packs result | Medium | Doc updated in this pass |
| P5 | README stale (tests row T1-T21, "Sıradaki" section, no packs) | Low | Fixed |
| P6 | `grade_ab.py` failed our complexity check | Low | Refactored; tests added (`test_ab.py`, mutation-checked) |
| P7 | Windows backslash and PowerShell paths untested in the lock guard | Medium (user's PC is Windows) | Tests added; guard already handled them |
| P8 | Pack read does not mean every trap is used: nextjs p3 item 6 (narrow client props) was in the pack and absent in all 6 answers | Low | Noted; not tuned to the test |
| P9 | Rubric item p4-6 (`three/addons`) conflicts with "match existing style" | Low | Rewrite item next time |
| P10 | `ai-production.md` is at 6,137 of 6,144 bytes: the size limit is full | Low | Next addition must remove text first |
| P14 | My own pack text was wrong: `ai-production.md` said ACE-Step is Apache-2.0; the 1.5 README, LICENSE file and Hugging Face model card say MIT (v1 was Apache-2.0). Round-2 answers in both arms repeated "Apache-2.0"; no rubric item depended on it | Medium (a license fact) | Fixed 2026-10-26 from the raw LICENSE file; both licenses allow commercial use, so no decision changed |
| P15 | Round 4, p12: B never read `security.md` (0/3); the model called `security-and-hardening` directly and that skill did not point to the pack. B = A (7.0 / 7.0) | Medium (a routing gap) | Fixed: one line in the skill. Follow-up (Tur 4b): pack read 3/3, score still 7.0 under the literal rubric (items 8-9 need a test per finding and a versioned standard); behavior moved toward the pack (test lines 3/3, OWASP codes 2/3) |
| P16 | Round 4 passes R8-R10 (B ≥ A in 6/6, ≥ A+1 in 5/6, pack read 15/18, cost 1.88x) but is weak evidence: rubric, packs and scoring by one person, arms guessable, n=3. Pack text present but unused: Unreal binary-asset rule and "measure on a real package" (0/3 in both arms), security test per finding | Medium | Stated in `results/2026-10-26.md`; no pack text changed. Idea if it repeats on the PC: a short report skeleton instead of longer packs |
| P11 | The skills live in `smart_camera`, an unrelated Python project | Medium | Decision 1 |

## 3. Risks (ranked)

1. **Skills never tried in a live session.** Headless runs differ from an interactive one (permission prompts, `/compact`, skill listing). Probability of surprise: Tahmin, moderate. Mitigation: PC test day.
2. **Pack facts age.** Dated 2026-10-25; vendors change terms (Hunyuan, Meshy, ElevenLabs, Steam). Mitigation: INDEX rule (re-read after three months); no automation.
3. **Gain is narrow.** Packs help where the model is wrong, cost 1.3-2.8x per task in tests (round 3 planning tasks 1.7-2.8x; round 4 1.25-2.4x, 1.88x overall). If a project is in the model's comfort zone, the pack is overhead. Mitigation: pointer lists named fields only; the control probe loaded no pack (3/3).
4. **Author bias.** I wrote packs and the rubric. n=3 per cell. Mitigation: pre-registration, blind scoring, honest verdicts.
5. **Codex parity unknown.** `AGENTS.md` is shared, skills path differs (`.agents/skills`); only the lock profile was run on Codex.
6. **Core budget is full** (920 of 920): adding a rule needs removing one.
7. **Unity-specific protection claims have no number.** README says so.

## 4. Assumptions for unanswered Doc questions

The user said unanswered questions use my recommendation.
- "Herness²": does not exist (the user confirmed in m15). Out of scope.
- "Sistem açıkları": both code vulnerabilities and plan logic gaps. Code: `security.md`, `security-and-hardening`, Semgrep/gitleaks/osv checks. Plan: Coverage lines, pre-mortem, `doubt-driven-development`.
- The 16k-star project: the six tools in the user's video; evaluated in the Plan Doc (karpathy-skills and ponytail adopted, superpowers split, others waiting).
- "The permission problem": unknown which. Assumption: both the Claude Code prompt and the model's own hesitation. Covered by the ledger, the Permissions rule and the settings template. Unproven in a live session.
- Nexus document: the user supplied v4 (m26); v5 is written.
- Who runs tests: I run headless ones now; real-session ones wait for the PC.
- Repo name: `pusula`, private. Not created (outward action).

## 5. Decisions for the user (not done by me)

1. Create a dedicated private `pusula` repository and move `pusula/` and `.pusula/` there.
2. Install Unity's official plugin: needs a license read, a SkillSpector scan, the PC and a yes.
3. Try `codebase-memory-mcp` and `rtk` in a throwaway clone (docs-only so far).
4. Keep `license_allow` empty (off) or set it for a commercial game.
5. Allow reading terms pages that need an account or return 403 (Tripo, Adobe Mixamo FAQ, Google Flow Music).
6. Allow a Unity content-format reader (UABEA, AssetRipper) on a copy of the build: new permission.
7. Unreal royalty: Epic's licence, EULA, FAQ and Epic Games Store revenue pages all return 403 here. The pack holds search-summary facts only (labeled secondary). Read the FAQ yourself before any money decision.

## 6. Needs the PC

Unity release build and REA measurement (`pc-runbook.md`); Unity extractor entry in `checks/config.json`; Unity UI main menu run (T3); `/context` figure; T24; hook run on Windows; skill auto-trigger in a live session; Unity official plugin install.

## 7. Verification log (this pass)

- `python -m unittest discover -s tests`: 106 tests, OK (7 skipped: need network, node modules or tools not set up). Run 2026-10-26.
- `pusula_check.py --root pusula --all`: CLEAN, 167 files (size, plan, hardcode, secrets, sast, complexity, architecture, deps).
- `measure.py load`: core 920/920, start 1,792/1,800, largest skill body 1,096/1,100, no file over 30 KB.
- SkillSpector on all `skills` (static, `--recursive --no-llm`, re-run 2026-10-26 after the pack and skill edits): every skill LOW; two findings, both false alarms: "don't apologize" in `frontend-design` (13/100) and `recipes` `packs/marketing.md:19` (7/100, MEDIUM EA2 "autonomous decision making"; it is the Turkish email-law paragraph I added, a description of what the law forbids, not an instruction to send). The LLM analyzers need an API key and did not run; a scan of one skill folder alone flags the pack pointer as "referenced artifact not inspected", so scan the whole tree.
- A/B: rounds 1-2 in `tests/results/2026-10-25b.md`; round 3 in `tests/results/2026-10-25c.md`; round 4 and the p12 follow-up in `tests/results/2026-10-26.md` (raw data `tests/results/data/r4`, `r4b`).
- `osv-scanner` on the camera project's `requirements.txt`: no issues (fixed earlier in commit 36b00ab).
- Pack facts closed from official pages on 2026-10-26 (earlier `[unverified]`): Steam trailer specs (Steamworks Trailers page), Flutter 3.47.8 with Dart 3.13.7 (Google's release feed), Unity `.meta` and YAML scene facts (three Manual pages), Turkish Law 6563 on commercial email (mevzuat.gov.tr PDF, read in full articles 6-8, 11, 12), itch.io, Apple and Google Play fees (through a page summarizer), ACE-Step 1.5 license and VRAM (raw LICENSE and README). Spot re-check of older `[official]` lines against raw sources (all matched): Tauri CSP, updater signature and key rules, `pubkey` not a path, camelCase arguments, serializable errors (tauri-docs source); Next.js 16.4.3, Node 20.9, TypeScript 5.1.0, Turbopack default, `next lint` move (npm registry and upgrade guide); three r186 and `gltf-validator` Apache-2.0 (npm registry); TRELLIS MIT, Kokoro Apache-2.0 (model card), Wan 2.1 Apache-2.0, AudioCraft code MIT and weights CC-BY-NC, Hunyuan3D 2.0 territory, 1M monthly users and no-improve-other-models clauses (raw licenses). FLUX and Stable Audio Open pages need a login (401): not re-checked. Still `[unverified]` or secondary: Unreal royalty, Epic Games Store revenue, EU email law (EUR-Lex returns an empty page), Tripo, Mixamo, ElevenLabs credit rules, Google Flow Music, loudness targets, Unreal C++ sast, hosted video tools.
