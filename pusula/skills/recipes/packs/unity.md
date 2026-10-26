# Pack: Unity

Read when the task touches a Unity project. Facts read 2026-10-26 on the pages named. Labels: [official], [reasoning], [unverified].

## Sources first
- Manual: https://docs.unity3d.com/6000.0/Documentation/Manual/ (use the folder that matches the project's `ProjectSettings/ProjectVersion.txt`). Pages used: UIElements.html, UI-system-compare.html, EditorCommandLineArguments.html, scripting-backends-il2cpp.html, managed-code-stripping.html (6000.0 folder); trap 7 pages: see there.
- Test Framework: https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/reference-command-line.html.
- Versions: https://unity.com/releases/unity-6. As read: 6.3 LTS is supported to December 2027; 6.0 LTS to October 2026; 6.2 is a non-LTS update. [official]
- Official plugin: `Unity-Technologies/unity-agent-plugin` (Unity 6+, skills, `/unity:ui-uitk`, uses the Unity CLI, no MCP, "Unity Companion License"). Not installed. License read 2026-10-26: use only with a Unity Engine License, install unmodified (changes to it are assigned to Unity), keep it out of the game's own license. Static scan: no hooks or shell scripts, but 32 skills (about 2,000 start tokens: project scope only), 4 skills pre-approve Bash/Write/Edit/WebFetch, one tells you to run `curl | bash`; SkillSpector gave 2 CRITICAL, 3 HIGH (not cleared). Needs the user's yes. Details: `.pusula/audit/wave2-tools.md`. [official]

## Before any code
1. Read `ProjectSettings/ProjectVersion.txt`, `Packages/manifest.json`, and whether the project uses uGUI, UI Toolkit or the Input System. Match them.
2. No Unity on this machine means no editor run. Say "not run in Unity" in the evidence table; do not claim it works. [reasoning]

## UI (the usual failure: a menu that looks wrong)
- For screen-overlay menus and HUDs across many resolutions, Unity lists UI Toolkit as the better fit (UXML, USS, UI Builder, data binding, global styles). uGUI is better for world-space UI, custom shaders and in-scene authoring. [official]
- Follow `ui-acceptance`: ask for a reference, write criteria first, judge a screenshot of every state. Colors, sizes and text go to USS variables or a theme asset, never inline. [reasoning]

## Traps
1. `-quit` with `-runTests` can end before tests finish; omit `-quit` for test runs. [official]
2. Only one Unity process can open a project. Close the editor first. [official]
3. `-executeMethod` needs the static method in an `Editor` folder; an exception exits with 1. Test Framework defines no common exit codes: read the result XML, not the code. [official]
4. Without `-accept-apiupdate` the API updater does not run in batch mode and compile errors can follow. [official]
5. Code stripping removes code the linker cannot see; reflection targets need `link.xml` or `[Preserve]`. [official]
6. IL2CPP converts scripts to C++ at build time and supports more platforms than Mono. It does not make a build copy-proof (`security-and-hardening/anti-copy.md`). [official]
7. A `.meta` file holds the asset's unique ID and import settings. If it is lost, every reference to the asset breaks and Unity makes a new one; move or rename an asset outside Unity only together with its `.meta`. Scenes and prefabs are text YAML, one document per object, with a `fileID` unique inside the file; `UnityYAMLMerge` ships with the editor for `.unity`, `.prefab` and `.meta` (other YAML assets need `--force`). Read 2026-10-26 on AssetMetadata.html, SmartMerge.html, FormatDescription.html. [official] The pages do not cover hand-editing, so edit through the editor or the official CLI. [reasoning]

## Checks
- Headless tests: `Unity -runTests -batchmode -projectPath <path> -testPlatform EditMode|PlayMode -testResults <file.xml> -logFile <log>`; filter with `-testFilter` or `-assemblyNames`. Result file is NUnit XML. [official]
- Build from the command line with `-buildTarget` and an `-executeMethod` build script. Read the log for warnings. [official; the build script is project code]
- Static: the repo's analyzers and the `pusula_check.py` run on `Assets/` code. Files over 30 KB are split.
- Release build: run the shield leak check (`pusula_check.py --only shield`). Real Unity measurements wait for the user's PC (`.pusula/build-shield/pc-runbook.md`).

## Done when
Tests pass from the command line (or "not run in Unity" is stated), the build log has no new warnings, every UI state has a screenshot, and the evidence table lists what was not seen.

## Vendor skills
`Unity-Technologies/unity-agent-plugin` (see above). Anything else: `find-skills`.
