# Pusula

Claude Code ve Codex için küçük, ucuz bir kural ve skill seti. Dalga 0 ve 1: metin dosyaları ve tek bir kontrol betiği. Hook, MCP ve alt ajan yok.

Plan belgesi: [Pusula — Tek Parça Yapay Zekâ Sistemi Planı](https://claude.ai/artifact/VuALtMD8uSuob6w3W3S7jU).

## İçindekiler

| Yol | Ne işe yarar | Başlangıç yükü |
| --- | --- | --- |
| `AGENTS.md` | Çekirdek kurallar. Her oturumda yüklenir. | ~780 jeton |
| `CLAUDE.md` | Tek satır: `@AGENTS.md`. Claude Code için köprü. | ~0 |
| `skills/*/SKILL.md` | 14 skill. Sadece ad ve açıklaması yüklenir; gövdesi gerekince. | ~650 jeton (14 açıklama) |
| `skills/plain-explain` | Sade Türkçe anlatım biçimi ve kesinlik etiketleri (Doğruladım, Resmi kaynak, Tahmin, Bakmadım). | gerekince |
| `skills/ui-acceptance` | Arayüz için kabul ölçütlerini koddan önce yazdırır, sonra ekran görüntüsünü satır satır yargılatır. | gerekince |
| `skills/recipes` | Yönlendirici: hangi iş için hangi skill, hangi sırayla. | gerekince |
| `skills/state-files` | Plan, bulgu ve ilerleme dosyası şablonları, izin defteri, devir notu. | gerekince |
| `checks/` | Mekanik kontroller: `pusula_check.py` (dosya boyutu, etiketli plan kodu, sabit değer, sır, bağımlılık açığı) ve ayar dosyası. Jeton harcamaz. | 0 |
| `THIRD_PARTY.md` | Kaynak, lisans, sabitlenen commit, yaptığımız değişiklik, tarama sonucu. | okunmaz |

## Kurulum (projeye)

1. `AGENTS.md` ve `CLAUDE.md` dosyalarını projenin köküne kopyala. Bir `CLAUDE.md` zaten varsa içine `@AGENTS.md` satırını ekle.
2. Claude Code için `skills/` klasörünün içeriğini `.claude/skills/` altına kopyala.
3. Codex için aynı içeriği `.agents/skills/` altına kopyala.
4. Kontroller için `checks/` klasörünü projeye `.pusula/checks/` olarak kopyala. Python 3 yeter. Araçları kur: `uv tool install semgrep`, gitleaks ve osv-scanner (kurulum sayfaları `checks/config.json` içinde). Eksik araç `[NOT CHECKED]` yazar, geçti sayılmaz.
5. Yeni oturum aç. Skill listesinde 14 skill'in göründüğünü kontrol et.

Kullanıcı düzeyinde kurmak istersen: Claude Code `~/.claude/skills/`, Codex `~/.agents/skills/`.

## Kurallar

- Skill'ler İngilizce, kullanıcıya anlatım sade Türkçe.
- Hiçbir dosya 30 KB'ı geçmez.
- Plana kod, sadece düşünülmüş ve etiketli girer: bloğun üstünde `Why code:` (neden kod) ve `Checked:` (nasıl doğrulandı) satırı olur. Uygulayıcı plandaki kodu önce kontrol eder.
- Yeni üçüncü taraf parça: önce SkillSpector taraması, sonra `THIRD_PARTY.md` kaydı.
- Her skill gövdesi kısa tutulur (en fazla ~1.100 jeton). Uzayan skill bölünür.

## Kontrolleri çalıştırma

`python .pusula/checks/pusula_check.py` tüm projeyi tarar. `--staged` sadece git'e eklenen değişiklikleri tarar. `--only size,plan,hardcode,secrets,deps` seçili kontrolleri çalıştırır. Çıkış kodu: 0 temiz, 1 bulgu var, 2 temiz ama bir kontrol çalışmadı. Eşikler ve dosya desenleri `checks/config.json` içinde; sabit değer kuralları `checks/semgrep/hardcode.yml` içinde (şimdilik C#, TS/JS, Dart, Rust, Python için genel kurallar).

## Sıradaki

Dalga 2: codebase-memory-mcp ve rtk, T7 jeton testiyle. Dalga 3: alan paketleri.
