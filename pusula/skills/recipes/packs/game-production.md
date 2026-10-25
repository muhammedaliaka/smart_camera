# Pack: Game production (RTS focus)

Read when the task plans or builds a game, especially an RTS. Facts read 2026-10-25 on the pages named. Labels: [official], [first-party account] (the team's own article), [secondary], [common practice], [user list], [reasoning], [unverified].

## Sources first
- Unity 6 manual (`https://docs.unity3d.com/6000.0/Documentation/Manual/`): `optimizing-draw-calls-choose-method.html`, `LevelOfDetail.html`, `AudioMixer.html`, `class-AudioManager.html`; pooling `ScriptReference/Pool.ObjectPool_1.html`; Entities `https://docs.unity3d.com/Packages/com.unity.entities@1.4/manual/index.html`. Unreal: MassEntity overview on `dev.epicgames.com/documentation/en-us/unreal-engine/`.
- Lockstep: "1500 Archers on a 28.8" by the Age of Empires team (`https://www.gamedeveloper.com/programming/1500-archers-on-a-28-8-network-programming-in-age-of-empires-and-beyond`) [first-party account]. Gaffer On Games `https://gafferongames.com/post/deterministic_lockstep/` and `/post/floating_point_determinism/` [secondary].
- Build and test commands: `unity.md`, `unreal.md`, `threejs-glb.md`. This pack: what to plan and measure.

## Scope list (fill before the plan; "none" is allowed, blank is not)
One row per heading: decision, risk, unknown. Headings from the user's list: player experience, simulation and determinism, network, performance, art pipeline, audio, UI, test, legal and commercial, scope and time, maintenance [user list]. The user said 12 and named 11; the 12th, game data and balance, is my addition. [reasoning]

## Asset classes (per class: needed? made how? budget? ledger row?) [user list]
- 3D: units, buildings (construction stages, ruins), resource nodes, props, weapons, projectiles, landmarks, terrain, water, sky.
- Surface: albedo, normal, metallic-roughness, emission, team-color mask, tileable ground, splat map, decals, atlases.
- Rig and animation: skeleton and weights; base clips (idle, walk, attack, death, hit); role clips (gather, build, carry, cast); animator state machine; animation events; IK; mechanical parts; spawn and victory.
- VFX: particles, trails, hit flash, selection rings, range markers, ability effects, weather, fog of war, post-process.
- Audio: SFX, voice barks, announcer, music states, ambience, mixer rules.
- UI: HUD, minimap, command panel, icons, portraits, cursors, health bars, selection box, menus, tooltips, fonts.
- Level data: map size, start points, resource spots, navigation data, fog data, thumbnails, lighting.
- Game data: unit and building stats, tech tree, balance tables, localization, bot profiles, key bindings, replay format, achievements.
- Story and release: concept art, lore, cinematics, voice-over, subtitles, logo; store capsules, screenshots, trailer, store text, EULA, privacy text.
Budgets (triangles, texture size, clip length, voices) go to the project config, never to this file.

## Optimization (measure first)
- Draw calls (Unity 6) [official]: SRP Batcher and GPU Resident Drawer are for URP and HDRP, not Built-In. Static batching does not work with GPU Resident Drawer or BRG. Avoid `MaterialPropertyBlock` in URP and HDRP. Share materials; use Material Variants for property changes. The page gives no instance counts.
- LOD [official]: Unity picks the level by distance to the camera; the lowest level can be a billboard asset.
- Pooling [official]: `UnityEngine.Pool.ObjectPool<T>` has get, release and destroy callbacks, `collectionCheck` for double release, and `maxSize`; past it, released items are destroyed.
- Many units: Unity's data-oriented route is Entities with Jobs and Burst; Unreal's is MassEntity (fragments, processors). Neither page says when to switch or gives unit counts. Decide from a profile of your own scene. [official facts; the rule is reasoning]
- Audio [official]: Max Virtual Voices must be larger than the voices the game plays; Max Real Voices limits simultaneous voices (defaults not on the page). The mixer has snapshots (moods) and ducking between groups.
- Not read in vendor docs [common practice]: flow-field or hierarchical pathfinding, spatial hashing for range queries, lower AI update rates for far units, texture compression and mip streaming, UI atlases.

## Traps (RTS determinism and measuring)
1. Lockstep sends commands, not unit state, so every machine runs the same simulation. Age of Empires ran commands two turns after issue, turns of about 200 ms; 250 ms of command latency went unnoticed, beyond 500 ms it showed. [first-party account]
2. Desync is caught by checksums of world, objects, pathfinding and targeting each turn, then stop at the first mismatch. [first-party account]
3. One seeded random generator for the simulation, the same number of calls everywhere; a separate one for cosmetics. Simulation code must not depend on free time, hardware or settings. [first-party account]
4. Floating point: same compiler, flags and CPU architecture; debug and release builds may differ; sin and cos can differ between CPU brands; set the FPU mode at start and re-check each tick. Sources disagree on how hard this is. Integers or fixed-point avoid the question (the article does not name fixed-point). [secondary; fixed-point is reasoning]
5. A shipped lockstep game ships its rules: `security-and-hardening/anti-copy.md`. [reasoning]
6. Editor profiles mislead; profile a build on target hardware. [common practice]

## Checks
- Replay test: record commands and seed, play twice (and on two builds), compare per-turn checksums; a mismatch is a bug at the first differing turn. [reasoning]
- Scale scene: maximum units per player times players, run several minutes; frame time and memory stay flat; pooled objects return. Numbers go in `.pusula/`, budgets in config.
- Every shipped asset has a ledger row (`ai-production.md`).

## Done when
The scope list has no blank row, every asset class is marked needed or not with a budget, the replay test and the scale scene ran (or "not run" is stated), and each optimization claim cites a measurement.

## Vendor skills
Unity: see `unity.md`. Anything else: `find-skills`.
