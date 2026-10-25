# Pack: three.js and glTF/GLB

Read when the task builds a three.js scene, loads models, or prepares GLB files for the web. Facts read 2026-10-25 on the pages named. Labels: [official], [reasoning], [unverified].

## Sources first
- API pages are in the repo as Markdown: `https://raw.githubusercontent.com/mrdoob/three.js/dev/docs/pages/<Class>.html.md` (for example `Texture`, `GLTFLoader`, `WebGLRenderer`). An index for agents sits at `docs/llms.txt` and `docs/llms-full.txt`. The website manual is a single page with `#` links, so fetch tools see only its sidebar. [official]
- As read: newest release r186 (24 Sep). Migration notes: https://github.com/mrdoob/three.js/wiki/Migration-Guide. Always read the project's `three` version first; pin it. [official]
- glTF validation: `gltf-validator` (npm, Apache-2.0, Khronos). The npm package is a library with no command: its README shows `validateBytes(new Uint8Array(bytes))`. Only the Dart-built CLI returns a non-zero code. We checked this by installing it. [official + ran in this session]
- Optimization: `@gltf-transform/cli` (https://gltf-transform.dev/cli). [official]

## Traps
1. `GLTFLoader` is an addon: `import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'`. [official]
2. Compressed files need their decoder registered on the loader: `setDRACOLoader` (Draco), `setKTX2Loader` (KTX2 textures), `setMeshoptDecoder` (meshopt). Without it the model fails to load. [official]
3. GPU memory is not freed by garbage collection. Call `dispose()` on geometries, materials, textures and render targets you no longer use, and `renderer.dispose()` when done. Image bitmaps need an explicit close. Removing an object from the scene does not dispose it. [official for dispose and bitmaps; "removal does not dispose" reasoning]
4. Shared resources: disposing a geometry, material or texture that other meshes still use breaks them. [reasoning]
5. Color data textures need `SRGBColorSpace` (the default is `NoColorSpace`); the renderer's `outputColorSpace` defaults to `SRGBColorSpace`. Data maps (normal, roughness) are not sRGB. [official; data-map rule reasoning]
6. Check leaks with `renderer.info.memory` (geometries, textures) and `renderer.info.render` (calls, triangles) after a scene change. [official]
7. Loading a GLB from a `file://` page fails in browsers: serve it over HTTP during tests. [common practice, unverified]
8. AI-made GLBs often have wrong scale, no pivot, huge textures or non-manifold meshes. Validate, inspect and look at it in the scene. [reasoning]
9. CDN import maps are fine for prototypes only; pin the exact version and ship the files you serve. [reasoning]

## Checks
- `npm install --save-dev gltf-validator`, then `node .pusula/checks/validate_glb.mjs <file-or-folder>...` (our 59-line wrapper): exit 0 clean, 1 errors, 2 not checked (package missing, no files, bad path). It prints each error code and pointer. Tested with 8 tests and 9 deliberate breakages (`tests/test_glb.py`; set `PUSULA_TEST_NODE_MODULES` for the 5 that need the package). [ran in this session]
- Install `@gltf-transform/cli` at a pinned version (its page shows a global npm install), then `gltf-transform inspect <file.glb>` for sizes and issues, then `optimize <in.glb> <out.glb> --compress draco --texture-compress webp` (the page's own example). Re-run the validator on the output and view it in the app. [official]
- Per-asset budgets (triangles, texture size, file size) come from the project's config, measured from the file, never from a guess. [reasoning]
- Open the page in a real browser (headless Chromium is available), take a screenshot, read the console for errors, and print `renderer.info`. [reasoning]

## Done when
Every GLB passes the validator, the scene runs in a browser with an empty console, `renderer.info` stays flat after loading and unloading a model, and a screenshot shows each state (loading, loaded, error).

## Vendor skills
Not looked at. `find-skills` before improvising.
