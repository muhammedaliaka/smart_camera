# Pusula

Claude Code ve Codex için küçük, ucuz bir kural ve skill seti. Dalga 0 ve 1: metin dosyaları ve tek bir kontrol betiği. Hook, MCP ve alt ajan yok.

Plan belgesi: [Pusula — Tek Parça Yapay Zekâ Sistemi Planı](https://claude.ai/artifact/VuALtMD8uSuob6w3W3S7jU).

## İçindekiler

| Yol | Ne işe yarar | Başlangıç yükü |
| --- | --- | --- |
| `AGENTS.md` | Çekirdek kurallar. Her oturumda yüklenir. | ~880 jeton (tahmin) |
| `CLAUDE.md` | Tek satır: `@AGENTS.md`. Claude Code için köprü. | ~0 |
| `skills/*/SKILL.md` | 15 skill. Sadece ad ve açıklaması yüklenir; gövdesi gerekince. | ~760 jeton (15 açıklama, tahmin) |
| `skills/plain-explain` | Sade Türkçe anlatım biçimi ve kesinlik etiketleri (Doğruladım, Resmi kaynak, Tahmin, Bakmadım). | gerekince |
| `skills/ui-acceptance` | Arayüz için kabul ölçütlerini koddan önce yazdırır, sonra ekran görüntüsünü satır satır yargılatır. | gerekince |
| `skills/architecture-standard` | NEXUS v5: dokuz kısa kural, tek mimari dosyası (`.pusula/architecture.md`), sorun günlüğü. Eski NEXUS v4'ün sadeleştirilmiş hali. | gerekince |
| `NEXUS_v5.md` | NEXUS v4'ün 19 kuralından neyin kaldığını, neyin birleştiğini, neyin atıldığını ve nedenini gösteren tablo. Projeye kopyalanmaz. | okunmaz |
| `skills/recipes` | Yönlendirici: hangi iş için hangi skill, hangi sırayla. | gerekince |
| `skills/state-files` | Plan, bulgu ve ilerleme dosyası şablonları, izin defteri, devir notu. | gerekince |
| `checks/` | Mekanik kontroller: `pusula_check.py` (dosya boyutu, etiketli plan kodu ve dolu Coverage satırları, sabit değer, sır, güvenlik açığı kuralları, fonksiyon karmaşıklığı, mimari dosyasındaki yolların varlığı, bağımlılık açığı, isteğe bağlı lisans) ve ayar dosyası. Jeton harcamaz. | 0 |
| `tests/` | T1–T7 test tablosu (`TESTS.md`), kontrol betiğinin birim testleri (`test_checks.py`), T6 ve T7 ölçüm betiği (`measure.py`), hedefler (`targets.json`). Projeye kopyalanmaz. | 0 |
| `THIRD_PARTY.md` | Kaynak, lisans, sabitlenen commit, yaptığımız değişiklik, tarama sonucu. | okunmaz |

## Kurulum (projeye)

1. `AGENTS.md` ve `CLAUDE.md` dosyalarını projenin köküne kopyala. Bir `CLAUDE.md` zaten varsa içine `@AGENTS.md` satırını ekle.
2. Claude Code için `skills/` klasörünün içeriğini `.claude/skills/` altına kopyala.
3. Codex için aynı içeriği `.agents/skills/` altına kopyala.
4. Kontroller için `checks/` klasörünü projeye `.pusula/checks/` olarak kopyala. Python 3 yeter. Araçları kur: `uv tool install semgrep`, `uv tool install lizard`, gitleaks ve osv-scanner (kurulum sayfaları `checks/config.json` içinde). Eksik araç `[NOT CHECKED]` yazar, geçti sayılmaz.
5. Yeni oturum aç. Skill listesinde 15 skill'in göründüğünü kontrol et.

Kullanıcı düzeyinde kurmak istersen: Claude Code `~/.claude/skills/`, Codex `~/.agents/skills/`.

## Kurallar

- Skill'ler İngilizce, kullanıcıya anlatım sade Türkçe.
- Hiçbir dosya 30 KB'ı geçmez.
- Plana kod, sadece düşünülmüş ve etiketli girer: bloğun üstünde `Why code:` (neden kod) ve `Checked:` (nasıl doğrulandı) satırı olur. Uygulayıcı plandaki kodu önce kontrol eder.
- Yeni üçüncü taraf parça: önce SkillSpector taraması, sonra `THIRD_PARTY.md` kaydı.
- Her skill gövdesi kısa tutulur (en fazla ~1.100 jeton). Uzayan skill bölünür.

## Kontrolleri çalıştırma

`python .pusula/checks/pusula_check.py` tüm projeyi tarar. `--staged` sadece git'e eklenen değişiklikleri tarar. `--only size,plan,hardcode,secrets,sast,complexity,architecture,deps,licenses` seçili kontrolleri çalıştırır (`sast`: Semgrep'in hazır güvenlik kuralları, `p/security-audit`; kuralları internetten indirir, internet yoksa "NOT CHECKED" der). `complexity`: bir fonksiyonun karmaşıklığı 10'u geçerse kalır (lizard). `architecture`: `.pusula/architecture.md` içindeki modül yolları yoksa kalır; dosya yoksa bir şey denetlemez. `licenses`: `config.json` içinde `license_allow` listesi doluysa, listede olmayan lisansı olan paketi bulur; liste boşken kapalıdır. Çıkış kodu: 0 temiz, 1 bulgu var, 2 temiz ama bir kontrol çalışmadı. Eşikler ve dosya desenleri `checks/config.json` içinde; sabit değer kuralları `checks/semgrep/hardcode.yml` içinde (şimdilik C#, TS/JS, Dart, Rust, Python için genel kurallar).

## Testler

`python -m unittest discover -s tests` kontrol betiğini sınar (bağımlılık ve `sast` testleri için `PUSULA_TEST_NET=1`). `python tests/measure.py load` başlangıç yükünü tahmin eder (karakter ÷ 4); gerçek rakam için host'ta `/context` bak. T1–T14 tablosu `tests/TESTS.md` içinde; ilk A/B sonuçları `tests/results/2026-10-22.md` içinde.

## Sıradaki

Dalga 2: codebase-memory-mcp ve rtk, T7 jeton testiyle. Dalga 3: alan paketleri.
