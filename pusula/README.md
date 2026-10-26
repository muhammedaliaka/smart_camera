# Pusula

Claude Code ve Codex için küçük, ucuz bir kural ve skill seti: metin dosyaları, mekanik kontroller ve isteğe bağlı bir ayar şablonu (okuma kilidi + sıkıştırma sonrası hatırlatma, iki küçük hook). MCP ve alt ajan yok.

Plan belgesi: [Pusula — Tek Parça Yapay Zekâ Sistemi Planı](https://claude.ai/artifact/VuALtMD8uSuob6w3W3S7jU).

## İçindekiler

| Yol | Ne işe yarar | Başlangıç yükü |
| --- | --- | --- |
| `AGENTS.md` | Çekirdek kurallar. Her oturumda yüklenir. | ~920 jeton (tahmin) |
| `CLAUDE.md` | Tek satır: `@AGENTS.md`. Eski Claude Code sürümleri için köprü (2.1.310 AGENTS.md'yi kendisi okuyor, çift yüklenmiyor). | ~0 |
| `skills/*/SKILL.md` | 18 skill. Sadece ad ve açıklaması yüklenir; gövdesi gerekince. | ~870 jeton (18 açıklama, tahmin; çekirdekle toplam 1.792) |
| `skills/plain-explain` | Sade Türkçe anlatım biçimi ve kesinlik etiketleri (Doğruladım, Resmi kaynak, Tahmin, Bakmadım). | gerekince |
| `skills/ui-acceptance` | Arayüz için kabul ölçütlerini koddan önce yazdırır, sonra ekran görüntüsünü satır satır yargılatır. | gerekince |
| `skills/architecture-standard` | NEXUS v5: dokuz kısa kural, tek mimari dosyası (`.pusula/architecture.md`), sorun günlüğü. Eski NEXUS v4'ün sadeleştirilmiş hali. | gerekince |
| `NEXUS_v5.md` | NEXUS v4'ün 19 kuralından neyin kaldığını, neyin birleştiğini, neyin atıldığını ve nedenini gösteren tablo. Projeye kopyalanmaz. | okunmaz |
| `skills/find-skills` | Elindeki skill yetmezse halka açık skill dizininde arar, en çok 3 seçenek sunar. Taramadan ve senin onayın olmadan kurmaz. Telemetri kapalı, sürüm sabit. | gerekince |
| `skills/hard-problems` | Zor mantık, matematik, geometri, zamanlama işleri için yöntem: tam tanım, bilinen çözüm, yavaş ama doğru referans, rastgele karşılaştırma, sonra hızlı sürüm. | gerekince |
| `skills/frontend-design` | Anthropic'in skill'i (Apache-2.0, değiştirilmedi). Arayüzün "yapay zekâ yapmış" gibi görünmesini engelleyen tasarım rehberi. Sadece yeni arayüz veya yeni görünüm için; projede tasarım sistemi varsa o kazanır. | gerekince |
| `skills/security-and-hardening/anti-copy.md` | Ürünün kopyalanmasını ve tersine mühendisliği zorlaştırma: ne işe yarar, ne yaramaz. Sadece sorulunca okunur. | gerekince |
| `skills/recipes` | Yönlendirici: hangi iş için hangi skill, hangi sırayla. | gerekince |
| `skills/recipes/packs/` | 13 alan paketi (Tauri/Rust, Unity, Unreal, Flutter, Next.js, three.js/GLB, yapay zekâ üretimi, güvenlik, pazarlama, satış, oyun üretimi, video yapma, video izleme) ve `INDEX.md`. Her biri 6 KB altında; tarihli, resmi sayfalardan okunmuş gerçekler, tuzaklar, kontroller, "bitti" ölçütü. `AGENTS.md` içindeki tek cümle modeli buraya yönlendirir. | gerekince (paket başına ~1.000–1.500 jeton) |
| `skills/state-files` | Plan, bulgu ve ilerleme dosyası şablonları, izin defteri, devir notu. | gerekince |
| `checks/` | Mekanik kontroller: `pusula_check.py` (dosya boyutu, etiketli plan kodu ve dolu Coverage satırları, sabit değer, sır, güvenlik açığı kuralları, fonksiyon karmaşıklığı, mimari dosyasındaki yolların varlığı, bağımlılık açığı) ve ayar dosyası. Jeton harcamaz. | 0 |
| `settings/` | `claude.settings.json` (okuma kilidi, erken sıkıştırma, paket skill listesini kısaltma, iki hook) ve `codex.config.toml` (aynı kilit listesi). Projeye birleştirilir, üzerine yazılmaz. | 0 |
| `checks/validate_glb.mjs` | Bir `.glb` dosyasını resmi Khronos doğrulayıcısıyla (kütüphane; komut satırı aracı yok) denetler. Node ve `gltf-validator` paketi gerekir. | 0 |
| `tests/` | T1–T29 test tablosu (`TESTS.md`); birim testleri: kontrol betiği (`test_checks.py`), kilit ve ayar (`test_settings.py`), paket yapısı (`test_packs.py`), shield raporu (`test_shield_report.py`), GLB (`test_glb.py`), A/B araçları (`test_ab.py`); T6 ve T7 ölçüm betiği (`measure.py`), hedefler (`targets.json`). Projeye kopyalanmaz. | 0 |
| `tests/ab/`, `tests/results/` | Başsız A/B deney düzeneği (`run_ab.py`, `grade_ab.py`, ön kayıt `PREREG.md`, sorular ve hazır projeler `probes/`); sonuç raporları ve anonim ham veri (`results/data/`). Projeye kopyalanmaz. | 0 |
| `THIRD_PARTY.md` | Kaynak, lisans, sabitlenen commit, yaptığımız değişiklik, tarama sonucu. | okunmaz |

## Kurulum (projeye)

1. `AGENTS.md` ve `CLAUDE.md` dosyalarını projenin köküne kopyala. Bir `AGENTS.md` zaten varsa (örneğin `create-next-app` yazdıysa) üzerine yazma: Pusula çekirdeğini onun altına ekle, framework'ün kendi bloğunu silme. Bir `CLAUDE.md` zaten varsa içine `@AGENTS.md` satırını ekle.
2. Claude Code için `skills/` klasörünün içeriğini `.claude/skills/` altına kopyala.
3. Codex için aynı içeriği `.agents/skills/` altına kopyala.
4. Kontroller için `checks/` klasörünü projeye `.pusula/checks/` olarak kopyala. Python 3 yeter. Araçları kur: `uv tool install semgrep`, `uv tool install lizard`, gitleaks ve osv-scanner (kurulum sayfaları `checks/config.json` içinde). Eksik araç `[NOT CHECKED]` yazar, geçti sayılmaz.
5. İsteğe bağlı ama önerilir, **kilit ve sıkıştırma**: `settings/claude.settings.json` içeriğini `.claude/settings.json` içine **birleştir** (var olan anahtarları silme). Codex için `settings/codex.config.toml` içeriğini `.codex/config.toml` içine birleştir. Hook komutu `python` çağırır; sadece `python3` olan makinede `python3` yaz. Ayrıntı ve sınırlar aşağıda: "Okuma kilidi".
6. Yeni oturum aç. Skill listesinde 18 skill'in göründüğünü kontrol et.

Kullanıcı düzeyinde kurmak istersen: Claude Code `~/.claude/skills/`, Codex `~/.agents/skills/`.

## Kurallar

- Skill'ler İngilizce, kullanıcıya anlatım sade Türkçe.
- Hiçbir dosya 30 KB'ı geçmez.
- Plana kod, sadece düşünülmüş ve etiketli girer: bloğun üstünde `Why code:` (neden kod) ve `Checked:` (nasıl doğrulandı) satırı olur. Uygulayıcı plandaki kodu önce kontrol eder.
- Yeni üçüncü taraf parça: önce SkillSpector taraması, sonra `THIRD_PARTY.md` kaydı.
- Her skill gövdesi kısa tutulur (en fazla ~1.100 jeton). Uzayan skill bölünür.

## Kontrolleri çalıştırma

`python .pusula/checks/pusula_check.py` varsayılan olarak son commit'ten beri değişen ve yeni dosyalara bakar (boyut, plan, sabit değer, karmaşıklık); eski kod sessiz kalır. Sır, güvenlik açığı, mimari ve bağımlılık kontrolleri her zaman tüm projeye bakar, çünkü eski koddaki açık da açıktır. `--all` her şeyi tüm projede çalıştırır (ilk denetim için). `--staged` sadece git'e eklenen değişiklikleri tarar. `--only size,plan,hardcode,secrets,sast,complexity,architecture,deps,licenses` seçili kontrolleri çalıştırır (`sast`: Semgrep'in varsayılan kural seti `p/default`, 19 planlı açıklı bir denemede 15'ini buldu, eski `p/security-audit` 7'sini; kuralları internetten indirir, internet yoksa "NOT CHECKED" der). `complexity`: bir fonksiyonun karmaşıklığı 10'u geçerse kalır (lizard). `architecture`: `.pusula/architecture.md` içindeki modül yolları yoksa kalır; dosya yoksa bir şey denetlemez. `licenses` (varsayılan KAPALI): projenin kullandığı kütüphanelerin lisanslarına bakar, oyunun kendi lisansına bakmaz. `config.json` içinde `license_allow` boşsa hiçbir şey denetlemez; `["@permissive"]` yazarsan MIT, Apache-2.0, BSD, ISC, 0BSD, Zlib, BSL-1.0, Unlicense ve CC0 dışındaki her lisans (GPL, AGPL, LGPL, MPL, bilinmeyen, ticari kullanıma kapalı) bulgu olur. Kapalıyken de lisans ve bağlantı `architecture.md` tablosuna yazılır. İnternet ister (osv-scanner); Unity paketlerini (`manifest.json`) ve elle eklenen DLL'leri görmez. Çıkış kodu: 0 temiz, 1 bulgu var, 2 temiz ama bir kontrol çalışmadı. Eşikler ve dosya desenleri `checks/config.json` içinde; sabit değer kuralları `checks/semgrep/hardcode.yml` içinde (şimdilik C#, TS/JS, Dart, Rust, Python için genel kurallar).

## Okuma kilidi (paket dosyaları)

Amaç: yapay zekâ kilit dosyalarını (`package-lock.json`, `yarn.lock`, `Cargo.lock`, `uv.lock` ve benzerleri), derleme çıktısını (`.next`, `dist`, `target`, `Library`, `Temp`, `obj`, `.venv` ...), `*.min.js` ve `*.map` dosyalarını **kendi başına açmasın**. Bunlar yüz binlerce jeton tutar, işe yaramaz. Açmak isterse sana sorar; sen "evet" dersen açar.

- **Claude Code:** `permissions.ask` içindeki `Read(...)` kuralları. Resmi belgeye göre `ask` kuralı hiçbir modda (bypass dahil) kendiliğinden onaylanmaz; `allow` onu geçemez. Okuma aracı, `@dosya` ve `cat`, `head`, `tail`, `sed` gibi yaygın komutlar kurala takılır (Doğruladım: headless Claude Code 2.1.310'da denendi; kimse cevaplamayınca reddedildi, model bunu dürüstçe söyledi, dolanmadı). `Bash` ve `Grep` için ek hook (`checks/lock_guard.py`) komutta kilitli bir yolun adı geçiyorsa yine sorar. Aynı hook, ayar dosyasındaki listeyi okur; tek liste.
- **Codex:** izin profilinde `deny` kuralları, sandbox uygular (Doğruladım: Codex CLI 0.164.0 `codex sandbox` içinde "Permission denied" verdi). Codex'te "sor" yok; kilit, sen profili değiştirene kadar kapalı.
- **Kendini koruma:** yapay zekâ `.claude/settings.json` veya `.pusula/checks/` dosyalarını düzenlemek isterse de sorar; kilidi sessizce kaldıramaz.
- **Sınır (dürüst olalım):** kilit bir güvenlik duvarı değil, "sormadan açma" kuralı. Komutta yol adı geçmiyorsa hook göremez (`grep -r x .` veya yolu hesaplayan bir betik). Tam çözüm işletim sistemi düzeyindeki sandbox'tır; Codex'te hazır, Claude Code'da ayrıca açılır (`sandbox.filesystem.denyRead`; belgeye göre joker karakter yolun ilk klasöründen sonra çalışıyor, `**/package-lock.json` gibi kalıpları denemedim). `node_modules` kasıtlı olarak kilitli değil: bir kütüphanenin gerçek API'sini görmek için bazen `.d.ts` okumak gerekir ve Grep aracı ripgrep tabanlı, `.gitignore`'u izler. `.claudeignore` dosyası Claude Code'da etkisizdir; bu yüzden kural kullanıyoruz. İstersen listeye `Read(**/node_modules/**)` ekle.
- **Kilidi kalıcı açmak:** ilgili satırı ayar dosyasından sil. Tek seferlik: yapay zekâ sorunca onayla.

## "Yapma" listesi ve sıkıştırma

- Sen "şunu yapma" dediğinde yapay zekâ bunu `.pusula/permissions.md` içine "Never" satırı olarak yazar. Sonradan sen **aynı eylemi açıkça istersen** yapar ve bunu söyler; aksi halde yapmaz. Çekirdek kurallarda tek cümle (AGENTS.md, İzinler).
- Bağlam sıkıştırılınca (`/compact` veya otomatik) Claude Code, kök `CLAUDE.md` ve skill açıklamalarını yeniden yükler ama konuşmadaki "yapma" cümleleri özete girmeyebilir. Bu yüzden `SessionStart` hook'u (`checks/after_compact.py`) sıkıştırmadan sonra `.pusula/permissions.md` ile en yeni `progress.md` dosyasını (en çok 3.000 bayt) yeniden okutur. Doğruladım: headless `/compact` sonrası hook çıktısı geldi. Doğrulamadığım: modelin "yapma"yı tam da cazip bir anda tutması; bunun gerçek oturum testi senin PC'ni bekliyor.
- Erken sıkıştırma: şablonda `autoCompactWindow: 200000` (Claude Code), `model_auto_compact_token_limit = 200000` (Codex). Varsayılanlar çok daha geç sıkıştırır; her tur bağlamın tamamını okuduğu için büyük bağlam pahalıdır (resmi maliyet belgesi). Bedeli: sıkıştırmada ayrıntı kaybolabilir; plan, bulgu ve izin dosyaları bu yüzden diskte.

## Limiti geç bitirmek (Claude Code)

Sırayla, en çok kazandıran başta:
1. **İşler arasında `/clear`.** Eski işin bağlamını taşımaz. Uzun ara verirsen önbellek süresi dolar ve sonraki mesaj tüm bağlamı yeniden işler (belgeye göre daha pahalı); uzun aradan önce `/clear` veya handoff notu.
2. **Paketle gelen skill listesini kısalt.** Şablondaki `skillOverrides` 19 yerleşik skill'i "name-only" yapar: oturum başına yaklaşık 2.100 jeton kazandırdı (ölçtüm). Hepsini kapatma: üçten azını görünür bırakmak ters tepti, +4–6K jeton çıktı.
3. **MCP kapalı.** Her sunucu bağlama araç bilgisi ekler; komut satırı aracı varsa onu seç (resmi maliyet belgesinin önerisi).
4. **Çekirdek kısa.** Pusula çekirdeği ~920 jeton; `CLAUDE.md` 200 satırı geçmesin.
5. **Düşük çaba, tek model.** Basit işte düşük effort; Sonnet, Opus'tan ucuz. Alt ajanlar ve ekipler daha pahalı olduğu için Pusula'da kapalı.
6. **Okuma kilidi ve kapsamlı kontrol.** Kilit, gereksiz dosya okumayı keser; `pusula_check.py` varsayılan olarak sadece değişen dosyalara bakar.

Kaynak: Claude Code maliyet belgesi, ayar ve hook belgeleri (2026-10-25). "Ne kadar kazandırır" rakamlarının çoğu **tahmin**; ölçtüklerim yukarıda "ölçtüm" diye işaretli.

## Anthropic'in skill'leri

Hepsini inceledim (liste `THIRD_PARTY.md`, "Reviewed, not installed"). **Kurduğum tek skill: `frontend-design`.** Tam da "yapay zekâ tadı" sorununu çözüyor: sıcak krem zemin + serif + toprak rengi vurgu, aynı yuvarlak köşeli kartlar, her başlığın üstünde büyük harfli etiket gibi bilinen "üretilmiş sayfa" izlerini adıyla sayıp kaçınmayı öğretiyor. Taramadan geçti (SkillSpector 13/100, SAFE; tek uyarı "Errors don't apologize" cümlesi, yanlış alarm). `docx`, `pdf`, `pptx`, `xlsx` açık kaynak değil; kurmadım. Diğerleri ya Claude Code'da zaten hazır geliyor (`claude-api`, `skill-creator`), ya MCP/test için fazla ağır, ya da kısa cevap kuralımızla çelişiyor (`discernment-nudge` cevaba soru ekler).

## Obsidian nedir, Pusula'ya girer mi?

**Obsidian**, notlarını bilgisayarında düz Markdown dosyaları olarak tutan, ücretsiz bir not uygulaması (resmi site: "free and flexible app"; notlar yerel, düz metin). Bir klasörü "kasa" (vault) olarak açarsın; notlar arası bağlantı, etiket ve grafik görünümü sunar. Yapay zekânın hafızası değildir; sadece dosyaları okuyup düzenlediğin güzel bir pencere.

- **Pusula'ya skill olarak eklemedim.** `kepano/obsidian-skills` (altı skill: obsidian-markdown, bases, json-canvas, cli, defuddle, knap) yalnızca proje bir Obsidian kasasıysa işe yarar. Pusula'nın `.pusula/` dosyaları zaten düz Markdown; Obsidian'sız da açılır.
- **Sana faydası (Tahmin):** oyun tasarım belgeleri, plan ve devir notlarını okumak için `.pusula/` klasörünü kasa olarak açabilirsin. Telefonda dosyaların oraya gelmesi için bir eşitleme yolu gerekir (git, bulut klasörü veya Obsidian'ın ücretli Sync'i); bunu denemedim. Projeyi kasa yaparsan `.obsidian/` klasörünü `.gitignore`'a ekle.
- `defuddle` (web sayfasından temiz Markdown çıkarır, jeton tasarrufu için) ileride bakılacak adaylardan; şimdilik kurulu değil.

## Kopyalamaya karşı (REA)

Sorduğun araç **REA** (`morluto/rea`, "Reverse Engineer Anything"): ajanlara bağlanan bir MCP sunucusu ve komut satırı aracı (MIT). JS ve Electron paketlerini (modül, import, kaynak haritası, rota), siteleri, .NET'i, **Unity IL2CPP metadata'sını**, APK'yı, Flutter'ı ve Ghidra/IDA ile native kodu okuyor; kayıtlı web trafiğinden (HAR) bir uygulamanın davranışını taklit eden ortam da çıkarabiliyor. Orijinal kaynağı geri getirdiğini iddia etmiyor (Resmi belge). Önceki sürümde yanlışlıkla ReVa'yı yazmıştım; o ayrı bir araç. REA'nın README'sini kopyalayan birçok sahte depo var; sadece `morluto/rea` ve npm'deki `rea-agents`.

Bunu **engelleyen** bir araç yok; yapılabilen şey maliyeti artırmak ve **ölçmek**. Özet (`skills/security-and-hardening/anti-copy.md`, tam plan `.pusula/build-shield/plan.md`):

1. Bedava hediye verme: kaynak haritası, `.pdb`, çıplak `global-metadata.dat`, `.env` yayında olmasın. REA kaynak haritalarını doğrudan okuyor.
2. Değerli mantık ve sırlar sunucuda dursun; her eylem sunucuda doğrulansın.
3. Unity: IL2CPP maliyeti artırır. REA metadata sürümlerini 24/27/29/31/39 çözüyor ve "tanınmayan (belki şifreli) başlık desteklenmez" diyor; BitMono bu dosyayı şifreleyen bir koruma belgeliyor. Çalışma anı bellek ve native kod analizi yine mümkün (denemedim).
4. JS: üreticilerin kendi rakamı, karartılmış kod %15–80 yavaşlıyor ve dosya büyüyor. VM koruması ücretli. Yani rapordaki "%5 büyüme" hedefi garanti değil, ölçülecek bir bütçe. **Ölçtüm (küçük bir JS örneğinde, REA 6.8.0):** karartma REA'nın bulduklarını 12'de 3'e indirdi, ama webcrack aracı eklenince 10'a geri çıktı. Ücretsiz karartma sadece meraklı okuyucuyu yavaşlatır. Bir kodlama ajanı da dört sürümden (düz, sıkıştırılmış, iki karartma) üç fonksiyonu tam doğru yeniden yazdı; karartma ona sadece %16–39 daha fazla para ettirdi. Daha zor ikinci testte (yol bulma, rastgele sayılı simülasyon, her sürümde 3 deneme) 12 koşunun 11'i tam doğruydu; karartma %37–71 daha fazla para ettirdi, yeteneği düşürmedi. Hâlâ küçük, kendi yazdığımız örnekler. Unity'de denenmedi.
5. Davranış (ağ trafiği, çalışma anı) gizlenemez; API'yi savun.
   **Sızıntı kontrolü hazır:** `python pusula/checks/pusula_check.py --only shield`. Yayın klasöründe kaynak haritası (içindeki kaynakla birlikte), `.pdb`, `.env`, `sourceMappingURL` ve çıplak `global-metadata.dat` arar. Ayarı `.pusula/shield.config.json` içinde: oyun türü, yayın klasörü, dört değerli sınıf (`ai`, `economy`, `network`, `content`) ve bütçeler. Boş sınıf ya da eksik klasör "temiz" sayılmaz, "kontrol edilmedi" denir. Normal çalıştırmada kendiliğinden koşmaz.
   **Rapor hazır:** `python pusula/checks/shield_report.py DÜZ.json KORUMALI.json --rea-version 6.8.0`. İki REA çıktısını karşılaştırır ve dört sınıfın her biri için "düz sürümdeki isim, metin ve sayıların yüzde kaçı korumalıda hâlâ görünüyor" tablosu verir. Boyut büyümesini kendisi hesaplar; açılış ve kare süresini sen ölçüp `--measure` ile verirsin. Sınır aşılırsa çıkış 1; bir şey ölçülemediyse ya da bir sınıfta hiç isim yoksa 2. Şimdilik sadece JS çıktısını okuyor. Unity çıktısı için `config.json` içine bir okuyucu girişi eklenecek; şeklini görmeden yazmadım.
6. RTS'te lockstep simülasyon her istemcide çalışır; kurallar oyunla gider. Korunabilecek: sunucu hizmetleri, içerik, veri, marka, kullanım şartları.

Pusula bunların hiçbirini kendiliğinden kurmaz. Plan **taslak**: JS örneğinde ölçüldü, Unity için senin bilgisayarındaki gerçek build'e ihtiyaç var (plan, "Unknowns"). REA ve webcrack'i bu makinede sadece kendi örneklerimizde çalıştırma izni verdin; kayıt `.pusula/permissions.md` içinde.

## Testler

`python -m unittest discover -s tests` kontrol betiğini, kilit ve ayarları, paket yapısını, shield raporunu, GLB doğrulamasını ve A/B araçlarını sınar. Bağımlılık ve `sast` testleri için `PUSULA_TEST_NET=1`; GLB testi için `PUSULA_TEST_NODE_MODULES=<klasör>` (içinde `gltf-validator` olan `node_modules`). `python tests/measure.py load` başlangıç yükünü tahmin eder (karakter ÷ 4; üçüncü taraf skill'ler gövde hedefinden muaf, `targets.json`); gerçek rakam için host'ta `/context` bak. T1–T29 tablosu `tests/TESTS.md` içinde; sonuçlar `tests/results/` altında (`2026-10-22.md` ilk A/B; `2026-10-25b.md`, `2026-10-25c.md` ve `2026-10-26.md` alan paketleri).

## Alan paketleri ve ölçülen etkisi

Paket, modelin ezberinin yanlış ya da eksik olduğu yerde işe yarar; modelin zaten iyi bildiği yerde yaramaz. Başsız `claude -p`, web yok, her soru 3 kez, ön kayıtlı kurallarla ölçtüm (ayrıntı ve sınırlar `tests/results/2026-10-25b.md`, `2026-10-25c.md` ve `2026-10-26.md`):

- **Yönlendirme:** İşaretçi olmadan model `Skill` aracını hiç çağırmadı (0/15); paket 12 koşunun 4'ünde açıldı. `AGENTS.md`'ye tek cümle eklenince beklenen paket 11/12 açıldı. Tur 3'te 9/9.
- **Fark çıkan yerler (A yalnız dosya → B Pusula):** Steam fiyat planı 6,3 → 9,0; Electron→Tauri planı 6,0 → 8,3; RTS ağ planı 4,0 → 8,7; Unity menü planı 3,0 → 6,0; Flutter yayın 6,3 → 7,7; Unreal paketleme 3,3 → 6,0; pazarlama 5,7 → 9,0; Steam fragmanı 5,7 → 9,0; video izleme 6,7 → 8,0. **Fark çıkmayan:** Flask güvenlik denetimi 7,0 → 7,0 (B paketi okumadı; beceriye yönlendirme satırı eklendi, puan yine değişmedi);  AI lisansları 9,0 → 8,7; Next.js incelemesi 7,0 → 7,0; three.js 6,3 → 7,0 (gürültü payı içinde).
- **Bedel:** B, A'nın ortalama 1,6 katı (tur 2), 2,4 katı (tur 3, planlama soruları) ve 1,9 katı (tur 4) maliyetli. Soru başına B 0,05–0,29 $.
- **Dürüst sınırlar:** n=3. Maddeleri paket metninden ben türettim; tur 3'te arm tam kör değildi. "Pakete bakıldı" demek "paketin hepsi uygulandı" demek değil (Next.js "istemciye giden veriyi daralt" 0/9; Unity "komut bayrakları" 0/3). Tur 1 ve tur 2 için ön kayıtlı kurallar tutmadı; tur 3 ve 4'ünki tuttu, ama kanıtı daha zayıf. Tur 4'te Unreal (ikili asset kuralı, gerçek pakette ölçüm) ve güvenlik (her bulguya test, sürümlü standart) paket metninde olduğu halde B cevaplarında çıkmadı.
- Bir paketi kapatmak istersen `INDEX.md` satırını sil; bu çalıştırma ucuz.

## Sıradaki

**Yazılı ama kurulmamış:** dalga 2 (codebase-memory-mcp, rtk) sadece belgelerden değerlendirildi; kurulmadı, T7 jeton testi yapılmadı. Üç aracın kodu 26 Ekim'de indirilip okundu ve tarandı, hiçbiri çalıştırılmadı (`.pusula/audit/wave2-tools.md`). Unity'nin resmi eklentisi (`unity-agent-plugin`): lisansı okundu (Unity Companion License: sadece Unity motor lisansıyla, değiştirmeden), SkillSpector 2 KRİTİK ve 3 YÜKSEK verdi (çoğu belge metni, temiz sayılmaz); kurulmadı, senin onayını bekliyor. Alan paketleri resmi sayfalardan yazıldı (2026-10-25; açık maddeler 2026-10-26'da yeniden okundu); 13 paketin 13'ü de A/B'de denendi (tur 1–4).

**Karar bekleyenler (sen):** Unity eklentisi ve bellek araçları (kurmadan önce taramalı); Unity derleme kopyasında içerik okuyucu (UABEA/AssetRipper) denemesi.

**PC gelince:** Unity release build üstünde REA ölçümü (`.pusula/build-shield/pc-runbook.md`); T3 gerçek Unity menü koşusu; T1 gerçek Electron→Tauri geçişi; `/context` rakamı; T24 ("yapma" kalıcılığı); hook'ların Windows'ta çalışması; skill'in gerçek oturumda kendiliğinden tetiklenmesi; Codex eşdeğerliği.
