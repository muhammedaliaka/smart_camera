---
name: architecture-standard
description: Use when adding or restructuring a module, layer or dependency, when a change touches 6 or more files, or for questions on structure, naming, complexity or logging.
license: MIT
---

# Architecture standard (NEXUS v5)

Pusula's rewrite of NEXUS_ARCH_STANDARD v4: fewer rules, one file instead of many, tools check what tools can. Kept, merged, dropped: `NEXUS_v5.md`. A typo, a rename or a one-file change needs none of this.

## N1 One map: `.pusula/architecture.md`
One page per project (`templates/architecture.md`): Layers, Modules, Dependencies. No MANIFEST per folder, no header per file: imports and exports are the truth, copies drift.
- Missing, and the task adds a module, layer or dependency? Draft it from the code, show it in two lines, carry on.
- Update it in the same change that adds or moves one. `pusula_check.py` fails when a Modules path does not exist.
- Dependencies: name, why, license, official link, one line. Any license is acceptable; record it so the user can credit it. Read this table before adding a library.

## N2 Contract first
A new module that others will call: write its signature first (type, interface, trait, schema or stubs), then the body. Changing a contract means updating every caller in the same change.

## N3 Names
Say WHAT, not HOW. Function: verb + object (`parseLogEntry`, not `process`). Variable: noun + context. One-letter names only as loop indexes. Short forms allowed: id, url, api, ui, db. A naming slip blocks a pull request, never a build.

## N4 Layers and public surface
A layer calls only the layer directly below it; data never flows up. Default: L0 infra, L1 app and entry, L2 pages, L3 core; L3 never touches L0. Put the real layers in the Layers table and let the platform enforce them, no custom analyzer:
- Unity: one .asmdef per layer; cyclical references are not allowed ([Unity manual](https://docs.unity3d.com/6000.3/Documentation/Manual/assembly-definitions-referencing.html)).
- Rust: separate crates or modules; items are private unless `pub`, `pub(crate)` stays inside the crate ([Rust Reference](https://doc.rust-lang.org/reference/visibility-and-privacy.html)).
- TypeScript: dependency-cruiser `forbidden` rules ([repo](https://github.com/sverweij/dependency-cruiser)).
- Other stacks: UNVERIFIED. Find the official way first.

Export only what another module needs, each with a one-line doc comment saying why. Turn the compiler on: Rust `#![warn(missing_docs)]` ([rustc](https://doc.rust-lang.org/rustc/lints/listing/allowed-by-default.html)); C# `DocumentationFile` makes CS1591 appear ([Microsoft](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/compiler-messages/cs1591)).

## N5 Small and plain
File under 30 KB. Function complexity at most 10: the `complexity` check runs lizard. Nesting at most 3, early return first (no tool; read for it).

## N6 No dead code
No commented-out code. A TODO carries date and reason: `TODO(2026-10-22): why`. One older than 30 days is done, deleted or moved to `.pusula/issues.md`. Git is the backup: no Back-Up folder. Deleting files still needs approval naming them (AGENTS.md).

## N7 Size of change sets the ceremony
- Up to 5 files: just do it.
- 6 to 20: before coding, write four lines in the task's `.pusula/<task>/progress.md` (files, contracts touched, how to undo, size) and tell the user. Continue unless they object, or the work is irreversible or outward.
- Over 20: stop. Split it, or write a plan (`writing-plans`) and get approval.

## N8 Three strikes
After three failed fixes (`systematic-debugging`), stop. The next try must change one of: abstraction level, who owns the boundary, or the data structure. Log strikes there too.

## N9 Failure, speed, logs
- A module that does I/O says in Modules what happens when it fails: fail fast, retry (how often), or degrade (to what). No silent errors.
- A performance budget comes from measurement. Not measured yet: write `unmeasured`, never a guess. Hot modules only.
- `.pusula/issues.md` (`templates/issues.md`): append only, never edit or delete a line. Format `[YYYY-MM-DD HH:MM] [OPEN|DONE|WARN|ERROR] [module] :: message`. Close an issue with a DONE line naming it. Past 30 KB, move older lines to `.pusula/issues-archive/<date>.md`.
- Runtime logs in the product use the same fields, carry no secrets or personal data.

## Check
Architecture file current, paths exist. `complexity` passes. Signature written before body. Impact note for 6+ files.
