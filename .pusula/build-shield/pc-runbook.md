# Build Shield: Unity test day (needs the user's PC)

Türkçe özet: Bilgisayar gelince bu listeyi sırayla yap. Önce oyunun release build'ini bir kopya klasöre al, REA ile "düz" ölçümü kaydet, sonra korumayı kopyaya uygula ve aynı ölçümü tekrarla. İki JSON dosyasını bana ver; tabloyu ben çıkarırım. Orijinal projeye dokunma.

Commands below are the exact CLI flags from `rea@6.8.0 --help` (read 2026-10-25). Not run on any Unity file yet, so the output shape is unverified.

## Before you start
1. Build the game once in Release, the way you ship it. Note whether it is IL2CPP or Mono (Project Settings, Player, Scripting Backend).
2. Copy the whole build folder to a scratch folder. Work only on the copy.
3. In another scratch folder: `npm install --ignore-scripts rea-agents@6.8.0`. Never run `rea-agents setup`. Run REA as `node node_modules/rea-agents/scripts/rea.mjs <command>`.
4. Check the permission log first: REA is allowed on our own fixtures only. The game is the user's own, but say so and log it in `.pusula/permissions.md` before the first run.

## Plain measurement (before protection)
- IL2CPP: `inspect-il2cpp-metadata <Game>_Data/il2cpp_data/Metadata/global-metadata.dat --format json > plain-metadata.json` (standard Unity Windows layout). Add `--binary GameAssembly.dll` to link method addresses. Collections: sections, images, types, methods, fields, properties, events, parameters, string_literals.
- Mono: `inspect-managed-members <Game>_Data/Managed/Assembly-CSharp.dll --format json > plain-members.json`, plus `inspect-managed-artifact` for identity.
- Data files: `inspect-byte-entropy <biggest data file>` for each class of content (maps, campaigns, balance tables). Near 8 bits per byte means packed or encrypted.
- Leak check on the build folder: `python pusula/checks/pusula_check.py --only shield` (needs `.pusula/shield.config.json` with `stack: unity`, `release_dir`, the four classes as namespace or path globs, `exclude`, budgets).

## Protect the copy, measure again
- Candidates, README level only, never run by us: Obfuz (MIT), BitMono. Read their Unity-version notes first. Apply to everything except `exclude` (serialized fields, reflection, engine-named items).
- Run the game's smoke test. If it fails, add the item to `exclude`, rebuild, repeat.
- Repeat the plain commands on the protected build, same flags, into `protected-*.json`.
- Measure start-up and frame time on the weakest target device, both builds. Pass them as `--measure max_startup_ms_growth PLAIN PROTECTED` and `--measure max_frame_ms_growth PLAIN PROTECTED`.

## Report
- Add a Unity extractor under `shield.report.extractors` in `pusula/checks/config.json` (paths to read from the JSON: types, methods, fields, string_literals). Pick the paths from the real file, not from guesses.
- `python pusula/checks/shield_report.py plain-*.json protected-*.json --root . --rea-version 6.8.0 --measure ...`
- Exit 0 clean, 1 over budget, 2 not judged. Only claims backed by this table go in the README.

## Ask the user at that point
- Content formats (`.assets`, AssetBundles, ScriptableObjects): REA lists no reader. Testing needs a third-party reader (for example UABEA or AssetRipper) on a copy; that is a new permission.
- Whether to try a paid VM option; it needs a price and terms check first.

## Never
- Commit builds, REA Evidence from the game, HARs or bundles.
- Claim a Unity number before the table exists. Today there is none.
