# Pack: Flutter and Dart

Read when the task touches a Flutter or Dart project. Facts read 2026-10-25 on the pages named. Labels: [official], [common practice] widely used but not on the page I read, [reasoning], [unverified].

## Sources first
- Docs: https://docs.flutter.dev. Pages used: /testing/overview, /app-architecture/guide, /deployment/obfuscate, /security, /perf/best-practices. Dart: https://dart.dev/tools/analysis, https://dart.dev/tools/dart-analyze.
- As read: newest stable tag 3.47.8 (23 Oct 2026); the release table page did not load, so Dart version [unverified]. Read the project's `pubspec.yaml` and `.fvmrc` or `flutter --version` before using this. [official]
- A 3.47.8 security note says it blocks compromised eMudhra CA keys: stay on the newest patch. [official]

## Structure to match (official recommendation, not a strict rule)
- UI layer: views (no business logic) and view models (UI state, commands). Data layer: repositories (one per data type, single source of truth, never depend on each other) and services (stateless wrappers over APIs, files, platform). Domain use-cases only when logic merges repositories or repeats. [official]
- This lines up with `architecture-standard`: record the layers in `.pusula/architecture.md` and run `pusula_check.py --only architecture`. [reasoning]

## Traps
1. Obfuscation (`--obfuscate --split-debug-info=<dir>`) only renames symbols, works on release builds only, is not supported for web, leaves enum names, and breaks code that compares `runtimeType.toString()`. Back up the symbols file or crash traces cannot be read (`flutter symbolize -i <trace> -d <symbols>`). [official]
2. Do not hardcode keys in Dart: anything shipped can be extracted. `--dart-define` values are still in the binary. Keep real secrets on a server. [common practice]
3. Store tokens in secure storage, not `shared_preferences`; never disable certificate checks (`badCertificateCallback` returning true); HTTPS only. [common practice]
4. Keep `build()` cheap, call `setState` low in the tree, use `ListView.builder` or `GridView.builder` for long lists, avoid `Opacity` and clips inside animations. Measure in profile mode, not debug; budget about 16 ms per frame at 60 Hz. [official]
5. Info-level analyzer issues do not fail analysis. Use `dart analyze --fatal-infos` (or `flutter analyze`) when the repo wants them to. A new `lints` release can fail old code: pin it. [official]
6. Widget tests cannot touch native dialogs or platform views. Use `integration_test` on a device or `patrol` for those. [official]
7. Do not override `operator ==` on widgets. [official]

## Checks
- `flutter analyze` (with `--fatal-infos` if the project uses it), `flutter test` (unit and widget), `flutter test integration_test` (verify against the integration docs; the testing overview does not list it). [official, with that caveat]
- Release build with the real flags for each target, then run it; screenshot every UI state (`ui-acceptance`). A debug run is not release evidence.
- `pusula_check.py --only secrets,deps`: osv-scanner 2.7.0 read a `pubspec.lock` here and flagged a known `http` 0.13.0 advisory (ran in this session). Commit the lockfile or the check has nothing to read.

## Done when
Analyzer is clean at the project's level, tests pass, a release build ran on a device or emulator (or "not run" is stated), strings and colors live in the theme or localization files, and empty, loading and error states have screenshots.

## Vendor skills
Not looked at. `find-skills` before improvising.
