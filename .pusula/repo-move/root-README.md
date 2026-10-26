# Pusula

Claude Code ve Codex için küçük, ucuz bir kural, skill ve mekanik kontrol seti. Kişisel kullanım için, özel depo.

- `pusula/` — kopyalanacak parça: `AGENTS.md`, `CLAUDE.md`, `skills/`, `checks/`, `hooks`, `tests/`. Başlamak için `pusula/README.md`.
- `.pusula/` — Pusula'nın kendi proje durumu: denetim (`audit/`), izin defteri (`permissions.md`), Build Shield planı.

Testler: `cd pusula && python -m unittest discover -s tests`
Kontroller: `python pusula/checks/pusula_check.py --root pusula --all`

Geçmiş, `smart_camera` deposundan taşındı (commit kimlikleri değişti, tarihler ve yazarlar korundu).
