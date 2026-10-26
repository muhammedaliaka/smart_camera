# Domain packs

A pack is a short reference file for one stack or field: where the official sources are, what was read and when, the traps, the checks, and what done means. Read the one pack that matches the task, never several at once, and never instead of the project's own files (versions, docs, `AGENTS.md`). A pack is dated: if its facts are over three months old, or the project's version differs, re-read the named official page before relying on it.

| Task is about | Pack | Facts read |
|---|---|---|
| Tauri, Rust apps, Electron-to-Tauri | `tauri-rust.md` | 2026-10-25 |
| Unity project, UI, builds, tests | `unity.md` | 2026-10-25 |
| Unreal Engine | `unreal.md` | 2026-10-26 |
| Flutter, Dart | `flutter.md` | 2026-10-25 |
| Next.js, React server code | `nextjs.md` | 2026-10-25 |
| three.js, glTF, GLB files | `threejs-glb.md` | 2026-10-25 |
| AI-made 3D, image, music, SFX, voice, rig, texture, video; licenses; Steam AI disclosure | `ai-production.md` | 2026-10-26 |
| Security audit, hardening, CI security (rules are in `security-and-hardening`) | `security.md` | 2026-10-25 |
| Store page, launch copy, posts, email, search | `marketing.md` | 2026-10-25 |
| Pricing, discounts, releasing a product, outreach plans | `sales.md` | 2026-10-26 |
| Game planning: scope list, asset classes, optimization, RTS lockstep and determinism | `game-production.md` | 2026-10-25 |
| Making or editing video (ffmpeg, trailers, renders) | `video-production.md` | 2026-10-25 |
| Understanding existing video (frames, transcripts) | `video-watching.md` | 2026-10-25 |

## Rules for every pack
- Vendor skills first: run `find-skills`. A pack lists none as installed; installing one needs a SkillSpector scan and the user's yes.
- No pack replaces `source-driven-development`: for a fact a pack does not hold, read the official page and label what you read.
- Labels used inside: [official] read on the vendor page, [secondary] news or search summary, [common practice], [reasoning], [unverified], [ran] run in a Pusula session.
- Every pack ends with "Done when". Use it as the exit check together with `verification-before-completion`.
- Adding or refreshing a pack: fetch the official pages, change only what you read, keep the file under 6 KB, run `python -m unittest discover -s tests`.
