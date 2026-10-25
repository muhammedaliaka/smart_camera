# Pack A/B: pre-registration (written before any run, 2026-10-25)

Amaç (Turkish, plain): Alan paketleri (`skills/recipes/packs/`) bir modele gerçekten yardım ediyor mu? Yönlendirici doğru paketi açıyor mu? Maliyeti ne? Bu dosya koşulardan **önce** yazıldı; sonuç görülünce değiştirilmedi. Değişiklik olursa aşağıda "Sonradan değişti" başlığı açılır.

## Design
- Same prompts, same fixtures, Sonnet 5.5, headless `claude -p`, 3 repeats, one clean git folder per run.
- **A:** fixture only. **B:** fixture + Pusula `AGENTS.md`, `CLAUDE.md`, all skills in `.claude/skills/` (packs included).
- Tools both arms: `Read,Glob,Grep,Skill`. No web, no Bash, no Write. Answer is the final message. The container's own user-level skills are the same in both arms (init event is saved to show which).
- Grading: answers are anonymized and shuffled; I score each against the item list below **before** seeing the arm. A regex grader runs as a cross-check; disagreements are reported, manual score wins.
- Pack-read audit (B only): from the stream log, did the run call `Skill` for `recipes`, read `packs/INDEX.md`, read the expected pack?

## Probes and items (1 point each)
**p1 Steam price plan** (expected pack `sales.md`)
1. Names the $100 fee (recouped at $1,000).
2. Says wait 30 days after paying the fee before first release.
3. Says "coming soon" page at least 2 weeks before release.
4. Store page review 3-5 business days / submit at least 7 days ahead.
5. No price change and no discount within 30 days of release (launch discount allowed at first release).
6. A price increase starts a 30-day discount cooldown (so the planned rise to $19.99 must be placed knowing this).
7. Paperwork / bank / tax / identity checks take 15-30 days.
8. Names the Steam page as source or marks unsure items; does not present all rules as certain without a source.
9. No invented forecast numbers (revenue, conversion) without an "assumption" label.

**p2 AI licenses** (expected pack `ai-production.md`)
1. MusicGen weights are CC-BY-NC: not for a sold game.
2. Hunyuan3D 2.0 license does not apply in the EU (Germany): not covered without Tencent's separate terms.
3. Names at least one more Hunyuan term: over 1M monthly users, outputs cannot improve other AI models, or notice file on distribution.
4. Offers a commercially usable alternative for music AND one for 3D, each with its license named.
5. Says read the license on the day of use, or keep a per-asset ledger (tool, version, license, date).
6. Mentions Steam's AI disclosure.
7. Mentions that purely AI-made output has weak or no copyright (US Copyright Office) or that human edits matter.
8. Does NOT say Hunyuan3D is simply allowed in Germany.
9. Marks uncertainty (not legal advice, verify, terms change).

**p3 Next.js review** (expected pack `nextjs.md`)
1. Says a Server Action is a public endpoint; the page redirect does not protect it.
2. Adds an auth check inside the action.
3. Adds an ownership check (invoice belongs to the user).
4. Validates `id` on the server.
5. Action should not return the raw row.
6. Client component receives whole rows (incl. fields it does not need): narrow the props.
7. Says `next build` does not run lint since Next 16: add a lint step to CI.
8. Concrete change per file (actionable, not generic advice).
9. Mentions a server-only data layer / secrets staying server side.

**p4 three.js GLB** (expected pack `threejs-glb.md`)
1. Draco needs `DRACOLoader` with a decoder path, attached with `setDRACOLoader`.
2. `scene.remove` does not free GPU memory: dispose geometry, materials, textures.
3. Warns that shared resources must not be disposed while still used.
4. Checks leaks with `renderer.info.memory` / `renderer.info.render`.
5. Validates the file with the Khronos glTF validator (`gltf-validator`).
6. Uses `three/addons/...` import path instead of `three/examples/jsm/...`.
7. Mentions `gltf-transform inspect` (or the CLI) to read the file.
8. Gives at least two distinct causes of the load failure (decoder, path or file://, console error).

**p5 Control** (no pack should load)
1. Correct: replays or moves commits onto a new base.
2. At most 4 sentences.
3. B loads no skill and reads no pack. (log audit)

## Pass rules
- R1: per probe p1-p4, mean score of B is at least the mean of A.
- R2: on at least 2 of p1-p4, B's mean is higher by 1 point or more.
- R3: B reads the expected pack in at least 8 of 12 runs on p1-p4.
- R4: p5: B reads no pack in 3 of 3 runs. Cost ratio B/A reported; flagged if over 2.0.
- If R1-R4 do not all hold, the result is reported as a fail with the cause.

## Known limits (stated before running)
- The author wrote the packs and the items; items come from pack text. This tests routing and use, not whether a pack fact is right (facts were read from official pages, see each pack).
- No web: A is handicapped on facts newer than the model's knowledge. In real use both arms could browse. B's edge here is partly "has dated facts in a file".
- 3 repeats per cell: small sample. A one-point gap can be noise.
- Prompts are in Turkish, so B's "plain Turkish" rule and A's default differ in style only.

## Sonradan değişti (2026-10-25, tur 1'den sonra)
- Tur 1 sonucu: R1, R2 ve R3 tutmadı. Sebep: model `Skill` aracını hiç çağırmadı (0/15), paketleri yalnız rastlantısal `Grep` ile buldu (R3: 4/12).
- Değişen: `AGENTS.md` Sources bölümüne tek cümlelik işaretçi (adlı alanlarda önce `recipes/packs/INDEX.md`); `recipes` açıklaması; `run_ab.py --arms`. Pass kuralları ve maddeler **değişmedi**.
- Tur 2 yalnız B ile koşuldu; A, tur 1'den alındı. Sonuçlar `results/2026-10-25b.md` içinde.
- Tur 2 sırasında `game-production.md` paketi eklendi; sorular bu pakete girmediği için etkisi yok.

## Tur 3: üç paket daha (2026-10-25, koşulardan önce yazıldı)
Kapsam: `tauri-rust.md`, `game-production.md`, `unity.md`. Bunlar kullanıcının yaşadığı hataların yeri (Tauri geçişi, RTS, Unity menü). Aynı tasarım: A = yalnız dosya, B = dosya + Pusula (işaretçili `AGENTS.md`), 3 tekrar, aynı araçlar, cevaplar karıştırılıp arm bilgisiz puanlanır. Promptlar `probes/p6-p8.txt`, hazır projeler `probes/p6` (küçük Electron uygulaması: CDN betiği, preload köprüsü, otomatik güncelleme) ve `probes/p8` (uGUI kullanan Unity 6 projesi iskeleti).

**p6 Electron'dan Tauri'ye geçiş planı** (beklenen paket `tauri-rust.md`)
1. Resmi Tauri belgelerinin Electron geçiş rehberi içermediğini söyler ya da eşleme tablosunu "resmi değil / kendi çıkarımım" diye etiketler.
2. `ipcMain`/`ipcRenderer` karşılığı olarak Tauri komutları (`invoke`) ve olayları verir.
3. `preload`/`contextBridge` karşılığı olarak capabilities (`src-tauri/capabilities/`) ve izinleri anar.
4. CSP'nin `tauri.conf.json` içinde ayarlanması gerektiğini söyler (varsayılan etkin değil) ve CDN betiğinin (`marked`) sorun olduğunu fark eder.
5. Rust komut argümanlarının doğrulanması gerektiğini söyler (Rust çekirdeği güvenilir, webview güvenilmez).
6. Güncelleyici: imza zorunlu, özel anahtar kaybolursa kurulu uygulamalar güncellenemez (`electron-updater` karşılığı).
7. Her hedef işletim sisteminin web görünümünü (WebView2, webkit2gtk) ayrı test etmek gerektiğini söyler.
8. Tauri v2 belgelerine (v2.tauri.app) dayanır; v1 ya da 3.0 alfa önermez.
9. Bitiş kanıtı: `cargo clippy`/`cargo test` ve uygulamanın çalıştırılıp bir komut çağrısının görülmesi; doğrulanmayan satırları listeler.

**p7 RTS ağ ve performans planı** (beklenen paket `game-production.md`)
1. Lockstep: ağdan birim durumu değil komutlar gider.
2. Tek tohumlu rastgele sayı üreteci, her makinede aynı çağrı sayısı; görsel efektler için ayrı üreteç.
3. Kayan nokta determinizmi riski (farklı CPU, derleyici, derleme türü) ve tam sayı ya da sabit nokta seçeneği.
4. Her turda sağlama toplamı (checksum) ile uyumsuzluk (desync) yakalama.
5. Komut gecikmesi: komutlar birkaç tur sonra çalışır (AoE örneği: 2 tur, ~200 ms) ve gecikme gizlenir.
6. Tekrar (replay) testi: komut + tohum kaydı, iki kez oynat, sağlama toplamlarını karşılaştır.
7. Ölçüm: editörde değil hedef build'de profil; en kalabalık sahne testi (8x200 birim).
8. En az 6 asset sınıfı sayar (takım rengi maskesi dahil) ve bütçelerin proje ayarında tutulacağını ya da kayıt/ledger tuttuğunu söyler.
9. Optimizasyonu ölçüme bağlar (SRP Batcher/URP, ObjectPool, Entities/DOTS kararı profile göre); birim sayısı eşiği uydurmaz.

**p8 Unity ana menü** (beklenen paket `unity.md`)
1. Önce projeyi okur (`ProjectVersion.txt`, `manifest.json`, mevcut `MainMenu.cs`) ve projenin uGUI kullandığını bulur.
2. UI Toolkit ile uGUI farkını söyler (ekran menüsü için UI Toolkit, dünya içi UI için uGUI) ve geçişi kullanıcıya bırakır ya da gerekçelendirir.
3. Referans ister ve kabul ölçütlerini koddan önce yazar.
4. Her durum (normal, üzerinde, basılı, odak, devre dışı) için ekran görüntüsü ister.
5. Renk, boyut ve metnin sabit yazılmayıp tema/USS değişkenine ya da anahtara gideceğini söyler (koddaki `new Color(...)` ve "OYNA" metinleri sabit).
6. "Unity'de çalıştırılmadı" diye açıkça yazar; çalışıyor demez.
7. Komut satırı testi: `-runTests -batchmode`, `-testPlatform`, `-testResults`; `-quit` kullanmaz.
8. Sürüme uygun resmi Unity 6 kılavuzuna dayanır; uydurma sayfa vermez.

**Kurallar (tur 3):** R5: p6-p8'de B ortalaması A'dan düşük değil. R6: en az 2 soruda B, A'dan en az 1 puan yüksek. R7: B beklenen paketi 9 koşunun en az 6'sında okur. Maliyet oranı bildirilir; 2,0 üstü işaretlenir. Hepsi tutmazsa başarısız sayılır. Sınırlar tur 1 ile aynı; ek olarak maddeleri paket metninden ben türettim.
