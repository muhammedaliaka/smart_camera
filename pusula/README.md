# Pusula

Claude Code ve Codex için küçük, ucuz bir kural ve skill seti. Dalga 0: sadece metin dosyaları. Betik, hook, MCP ve alt ajan yok.

Plan belgesi: [Pusula — Tek Parça Yapay Zekâ Sistemi Planı](https://claude.ai/artifact/VuALtMD8uSuob6w3W3S7jU).

## İçindekiler

| Yol | Ne işe yarar | Başlangıç yükü |
| --- | --- | --- |
| `AGENTS.md` | Çekirdek kurallar. Her oturumda yüklenir. | ~780 jeton |
| `CLAUDE.md` | Tek satır: `@AGENTS.md`. Claude Code için köprü. | ~0 |
| `skills/*/SKILL.md` | 11 skill. Sadece ad ve açıklaması yüklenir; gövdesi gerekince. | ~550 jeton (11 açıklama) |
| `skills/recipes` | Yönlendirici: hangi iş için hangi skill, hangi sırayla. | gerekince |
| `skills/state-files` | Plan, bulgu ve ilerleme dosyası şablonları, izin defteri, devir notu. | gerekince |
| `THIRD_PARTY.md` | Kaynak, lisans, sabitlenen commit, yaptığımız değişiklik, tarama sonucu. | okunmaz |

## Kurulum (projeye)

1. `AGENTS.md` ve `CLAUDE.md` dosyalarını projenin köküne kopyala. Bir `CLAUDE.md` zaten varsa içine `@AGENTS.md` satırını ekle.
2. Claude Code için `skills/` klasörünün içeriğini `.claude/skills/` altına kopyala.
3. Codex için aynı içeriği `.agents/skills/` altına kopyala.
4. Yeni oturum aç. Skill listesinde 11 skill'in göründüğünü kontrol et.

Kullanıcı düzeyinde kurmak istersen: Claude Code `~/.claude/skills/`, Codex `~/.agents/skills/`.

## Kurallar

- Skill'ler İngilizce, kullanıcıya anlatım sade Türkçe.
- Hiçbir dosya 30 KB'ı geçmez.
- Plana kod yazılmaz. Şablonlarda kod bloğu yok.
- Yeni üçüncü taraf parça: önce SkillSpector taraması, sonra `THIRD_PARTY.md` kaydı.
- Her skill gövdesi kısa tutulur (en fazla ~1.100 jeton). Uzayan skill bölünür.

## Sıradaki

Dalga 1: Semgrep, gitleaks, osv-scanner betikleri ve mekanik kontroller (dosya boyutu, sabit değer, plan içinde kod). Dalga 2: codebase-memory-mcp ve rtk, T7 jeton testiyle. Dalga 3: alan paketleri.
