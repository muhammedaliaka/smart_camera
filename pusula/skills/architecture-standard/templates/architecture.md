# Architecture

Updated: <date>. One page. `pusula_check.py` checks that every Modules path exists.

## Stack
Name and version. Commands to build, test, lint and type-check, each run once or marked UNVERIFIED. Official docs, security guide, native analyzers. See `stacks.md` in the `architecture-standard` skill.

| What | Command or link |
|---|---|
| Stack and version | <e.g. name 1.2.3> |
| Build | <command> |
| Test | <command> |
| Lint and types | <command> |
| Docs and security guide | <official links> |

## Layers
A layer may call only the layer listed. Data flows down. Change the rows to the project's real layers.

| Layer | What lives here | May call |
|---|---|---|
| L0 | Infra: storage, network, OS | L1 |
| L1 | App and entry points | L2 |
| L2 | Pages and orchestration | L3 |
| L3 | Core components | nothing above |

## Modules
Path is relative to the project root (a glob such as `src/*/` is fine). "If it fails" only for modules that do I/O. Budget only for hot modules, from measurement, or `unmeasured`.

| Path | Does what (one line) | If it fails | Budget |
|---|---|---|---|
| <module path> | <one line> | <fail fast / retry n times / degrade to ...> | <unmeasured> |

## Dependencies
Why each one is here. Any license is fine; the link lets the user credit it.

| Name | Why | License | Link |
|---|---|---|---|
| <name> | <one line> | <as stated by the project> | <official page> |
