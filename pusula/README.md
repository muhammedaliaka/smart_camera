# Pusula

Claude Code ve Codex için küçük, ucuz bir kural ve skill seti: metin dosyaları, mekanik kontroller ve isteğe bağlı bir ayar şablonu (okuma kilidi + sıkıştırma sonrası hatırlatma, iki küçük hook). MCP ve alt ajan yok.

Plan belgesi: [Pusula — Tek Parça Yapay Zekâ Sistemi Planı](https://claude.ai/artifact/VuALtMD8uSuob6w3W3S7jU).

## İçindekiler

| Yol | Ne işe yarar | Başlangıç yükü |
| --- | --- | --- |
| `AGENTS.md` | Çekirdek kurallar. Her oturumda yüklenir. | ~910 jeton (tahmin) |
| `CLAUDE.md` | Tek satır: `@AGENTS.md`. Eski Claude Code sürümleri için köprü (2.1.310 AGENTS.md'yi kendisi okuyor, çift yüklenmiyor). | ~0 |
| `skills/*/SKILL.md` | 18 skill. Sadece ad ve açıklaması yüklenir; gövdesi gerekince. | ~860 jeton (18 açıklama, tahmin) |
| `skills/plain-explain` | Sade Türkçe anlatım biçimi ve kesinlik etiketleri (Doğruladım, Resmi kaynak, Tahmin, Bakmadım). | gerekince |
| `skills/ui-acceptance` | Arayüz için kabul ölçütlerini koddan önce yazdırır, sonra ekran görüntüsünü satır satır yargılatır. | gerekince |
| `skills/architecture-standard` | NEXUS v5: dokuz kısa kural, tek mimari dosyası (`.pusula/architecture.md`), sorun günlüğü. Eski NEXUS v4'ün sadeleştirilmiş hali. | gerekince |
| `NEXUS_v5.md` | NEXUS v4'ün 19 kuralından neyin kaldığını, neyin birleştiğini, neyin atıldığını ve nedenini gösteren tablo. Projeye kopyalanmaz. | okunmaz |
| `skills/find-skills` | Elindeki skill yetmezse halka açık skill dizininde arar, en çok 3 seçenek sunar. Taramadan ve senin onayın olmadan kurmaz. Telemetri kapalı, sürüm sabit. | gerekince |
| `skills/hard-problems` | Zor mantık, matematik, geometri, zamanlama işleri için yöntem: tam tanım, bilinen çözüm, yavaş ama doğru referans, rastgele karşılaştırma, sonra hızlı sürüm. | gerekince |
| `skills/frontend-design` | Anthropic'in skill'i (Apache-2.0, değiştirilmedi). Arayüzün "yapay zekâ yapmış" gibi görünmesini engelleyen tasarım rehberi. Sadece yeni arayüz veya yeni görünüm için; projede tasarım sistemi varsa o kazanır. | gerekince |
| `skills/security-and-hardening/anti-copy.md` | Ürünün kopyalanmasını ve tersine mühendisliği zorlaştırma: ne işe yarar, ne yaramaz. Sadece sorulunca okunur. | gerekince |
| `skills/recipes` | Yönlendirici: hangi iş için hangi skill, hangi sırayla. | gerekince |
| `skills/state-files` | Plan, bulgu ve ilerleme dosyası şablonları, izin defteri, devir notu. | gerekince |
| `checks/` | Mekanik kontroller: `pusula_check.py` (dosya boyutu, etiketli plan kodu ve dolu Coverage satırları, sabit değer, sır, güvenlik açığı kuralları, fonksiyon karmaşıklığı, mimari dosyasındaki yolların varlığı, bağımlılık açığı) ve ayar dosyası. Jeton harcamaz. | 0 |
| `settings/` | `claude.settings.json` (okuma kilidi, erken sıkıştırma, paket skill listesini kısaltma, iki hook) ve `codex.config.toml` (aynı kilit listesi). Projeye birleştirilir, üzerine yazılmaz. | 0 |
| `tests/` | T1–T21 test tablosu (`TESTS.md`), kontrol betiğinin birim testleri (`test_checks.py`), kilit ve ayar testleri (`test_settings.py`), T6 ve T7 ölçüm betiği (`measure.py`), hedefler (`targets.json`). Projeye kopyalanmaz. | 0 |
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

`python .pusula/checks/pusula_check.py` varsayılan olarak son commit'ten beri değişen ve yeni dosyalara bakar (boyut, plan, sabit değer, karmaşıklık); eski kod sessiz kalır. Sır, güvenlik açığı, mimari ve bağımlılık kontrolleri her zaman tüm projeye bakar, çünkü eski koddaki açık da açıktır. `--all` her şeyi tüm projede çalıştırır (ilk denetim için). `--staged` sadece git'e eklenen değişiklikleri tarar. `--only size,plan,hardcode,secrets,sast,complexity,architecture,deps` seçili kontrolleri çalıştırır (`sast`: Semgrep'in varsayılan kural seti `p/default`, 19 planlı açıklı bir denemede 15'ini buldu, eski `p/security-audit` 7'sini; kuralları internetten indirir, internet yoksa "NOT CHECKED" der). `complexity`: bir fonksiyonun karmaşıklığı 10'u geçerse kalır (lizard). `architecture`: `.pusula/architecture.md` içindeki modül yolları yoksa kalır; dosya yoksa bir şey denetlemez. Lisans kontrolü yoktur; her lisans serbest, lisans ve bağlantı `architecture.md` tablosuna yazılır. Çıkış kodu: 0 temiz, 1 bulgu var, 2 temiz ama bir kontrol çalışmadı. Eşikler ve dosya desenleri `checks/config.json` içinde; sabit değer kuralları `checks/semgrep/hardcode.yml` içinde (şimdilik C#, TS/JS, Dart, Rust, Python için genel kurallar).

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

## Kopyalamaya karşı

ReVa (Ghidra için MCP sunucusu) bir modelin derlenmiş programdaki çözülmüş kodu, metinleri ve çağrı ilişkilerini okumasını sağlıyor; resmi README'ye göre büyük programları ve donanım yazılımı imajlarını da işleyebiliyor. Yani bunu **engelleyen** bir araç yok; yapılabilen şey maliyeti artırmak. Özet (`skills/security-and-hardening/anti-copy.md`):

1. Değerli mantık ve veri istemcide durmasın: hesaplar, satın alma, sıralama, denge verisi, hile kontrolü ve her sır sunucuda, her eylem sunucuda doğrulanır.
2. Tasarımın zorunlu kıldığını bil: deterministik "lockstep" bir RTS'de tüm simülasyon her istemcide çalışır; kurallar oyunla birlikte gider. Korunabilecekler: sunucu hizmetleri, içerik, marka, kullanım şartları.
3. Unity: Mono derlemesi okunur C# verir. IL2CPP maliyeti artırır ama `global-metadata.dat` düz bir dosya; Il2CppDumper ve Cpp2IL isimleri ve metinleri oradan okur. BitMono gibi bir karartıcı bu dosyayı da şifreleyebiliyor (BitMono belgesine göre; denemedim).
4. Karartma kilit değil, sadece maliyet; yansıma (reflection) ve derleme süresini bozabilir.
5. Kullanım şartı + hukuk (ülkeye göre değişir; avukat), ve her sürüme özel işaretler ile sızıntının kaynağını kanıtlamak.

Pusula bunların hiçbirini kendiliğinden kurmaz. Kullanıcı korumak isterse yapay zekâ önce "kimden korunuyoruz?" diye sorar.

## Testler

`python -m unittest discover -s tests` kontrol betiğini sınar (bağımlılık ve `sast` testleri için `PUSULA_TEST_NET=1`). `python tests/measure.py load` başlangıç yükünü tahmin eder (karakter ÷ 4; üçüncü taraf skill'ler gövde hedefinden muaf, `targets.json`); gerçek rakam için host'ta `/context` bak. T1–T14 tablosu `tests/TESTS.md` içinde; ilk A/B sonuçları `tests/results/2026-10-22.md` içinde.

## Sıradaki

Dalga 2: codebase-memory-mcp ve rtk, T7 jeton testiyle. Dalga 3: alan paketleri (Unity, Tauri, Flutter; Next.js var). PC gelince gerçek oturum testleri: "yapma" listesinin cazip anda tutması, mimari skill'inin kendiliğinden tetiklenmesi, hard-problems kanıtı.
