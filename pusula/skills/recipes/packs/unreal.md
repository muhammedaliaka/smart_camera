# Pack: Unreal Engine

Read when the task touches an Unreal project. The user has not used Unreal yet; this pack is a starting map. Facts read 2026-10-25. Labels: [official], [secondary] search summary or news, not the vendor page itself, [reasoning], [unverified].

## Sources first
- Docs: https://dev.epicgames.com/documentation/en-us/unreal-engine. Use the page for the project's own engine version (the `EngineAssociation` field in the `.uproject` file). Pages used: the 5.8 release notes, the automation-tests page, the build-operations page. [official]
- As read: the 5.8 release notes exist; headline items: MegaLights production ready, Lumen Lite (beta), Mesh Terrain (experimental), Iris replication and Mutable production ready, Movie Render Graph production ready, Windows audio defaults to WASAPI. The notes page also lists an **experimental MCP server** that lets agentic tools connect to the editor. Pusula keeps MCP off by default: enabling it is the user's decision after a scan. [official]
- Release timing: news sites say 5.8 was announced on 17 June 2026 and call it the last 5.x release, with UE6 previews "late 2027ish". Treat as [secondary] until the vendor says so.
- Royalty: Epic's licence, EULA and FAQ pages returned 403 again on 2026-10-26. Search summaries that quote them say: 5% only on gross revenue above the first $1 million USD, provided the Release Form is filed on time; first $1,000,000 lifetime gross revenue per Product is royalty-free; the old $3,000 quarterly exclusion is gone. CG Channel (Oct 2024): "Launch Everywhere with Epic" cuts 5% to 3.5% for Windows, macOS and Android games released on the Epic Games Store first or at the same time as other stores, from 1 Jan 2025, not for games already on the store before; sales where Epic processes payment do not count toward the first $1 million. A report date "45 days after each quarter" was seen once and not confirmed. [secondary, verify before any money decision]

## Traps
1. Do not write build or cook commands from memory. Epic says to generate the command from a Custom Launch Profile in the Project Launcher (Platforms, Project Launcher) and read it from the Output Log; the arguments after `BuildCookRun` go to `RunUAT` (`Engine/Build/BatchFiles`, `RunUAT.bat` on Windows, `RunUAT.sh` on Mac and Linux). Key flags named there: `-project=`, `-clientconfig=`. [official]
2. Command-line tests: `-ExecCmds="Automation RunTest <Test1+Test2>;Quit"`, by group `Group:<Name>`, or by set `MySet.MySubSet`; results go to `-ReportExportPath="<folder>"` as JSON plus HTML; `-ResumeRunTest` resumes and marks in-progress tests as failed. The page does not cover `-unattended`, `-nullrhi` or `-TestExit`: check `-help` on the installed build. [official]
3. Binary assets (`.uasset`, `.umap`) cannot be reviewed or merged as text. Keep a rule for who edits what; never "fix" them with a script. [reasoning]
4. C++ changes need a rebuild and an editor restart; Blueprint-only changes do not. Say which one you did. [reasoning, unverified for 5.8]
5. Engine source is large and slow to build. Do not clone or compile it unless the task needs it. [reasoning]
6. Packaged-build size and performance come from the real packaged build on the weakest target, not from the editor. [reasoning]
7. Shipped builds can still be read: see `security-and-hardening/anti-copy.md` (Unreal not tested there).

## Checks
- Run the project's automation tests from the command line and read the exported JSON report, not just the exit code.
- Package a build via the generated BuildCookRun command, launch it, and screenshot each UI state.
- `pusula_check.py` on C++ and config files you touched (size, hardcode, secrets); Unreal C++ rules for sast are [unverified].

## Done when
Tests ran and the report was read, the packaged build launched (or "not run in Unreal" is stated), any hand-written cook command was first compared with the Project Launcher output, and each unverified item is listed.

## Vendor skills
Not looked at. `find-skills` before improvising.
