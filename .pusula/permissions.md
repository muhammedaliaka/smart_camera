# Permissions

Granted by the user. Stays in force until revoked. Read before asking. Irreversible or outward actions still need fresh approval naming the exact action.

| Date | What is allowed | Scope (tool, folder, repo) | Revoked? |
| --- | --- | --- | --- |
| 2026-10-25 | Run the REA CLI (`rea-agents` 6.8.0, installed with `--ignore-scripts`) to measure builds we create ourselves. The user said "izin veriyorum" in chat. Not covered: `rea-agents setup`, MCP registration, analyzing software we do not own or may not examine | scratchpad folder and fixtures built from our own code | no |
| 2026-10-25 | Install (`--ignore-scripts`) and run webcrack 2.16.0 (MIT, maintainer j4k0xb) to model a deobfuscator on builds we create ourselves. The user answered "Evet, kendi örneklerimizde". Not covered: running it on software we do not own or may not examine | scratchpad folder and fixtures built from our own code | no |
| 2026-10-25 | Install (`--ignore-scripts`) and run Wakaru `@wakaru/cli` 1.15.0 (Apache-2.0, maintainer pionxzh) to model REA source recovery on builds we create ourselves. The user answered "Evet, kendi örneklerimizde". Not covered: running it on software we do not own or may not examine | scratchpad folder and fixtures built from our own code | no |
