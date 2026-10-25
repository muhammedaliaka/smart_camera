# Pack: Tauri and Rust

Read when the task touches Tauri, Rust app code, or an Electron-to-Tauri move. Facts read 2026-10-25 on the pages named. Labels: [official] page text, [reasoning] my inference, [unverified] not read.

## Sources first
- Docs (v2): https://v2.tauri.app. Pages used: /security/, /security/capabilities/, /security/csp/, /security/lifecycle/, /concept/inter-process-communication/, /develop/calling-rust/, /develop/tests/, /develop/tests/mocking/, /plugin/updater/, /start/prerequisites/, /start/migrate/from-tauri-1/.
- Releases: https://github.com/tauri-apps/tauri/releases. Read the version in the project's `Cargo.toml` and `package.json`, not this file.
- As read: core 2.12.5 (21 Oct), CLI 2.12.4, and a 3.0.0 alpha pre-release exists. Do not use the alpha unless the user asks. [official]
- The docs list no Electron guide. Any Electron mapping you build is [reasoning] until each row cites a Tauri page. Typical rows: main process becomes the Rust core; `ipcMain`/`ipcRenderer` become commands (`invoke`) and events; `BrowserWindow` becomes a webview window; preload bridges become capabilities plus commands.

## Model
- Rust core is trusted. The webview is not. Everything crosses IPC and must serialize to JSON. [official]
- Capabilities live in `src-tauri/capabilities/` (JSON or TOML) and name `identifier`, `windows`, `permissions`, optional `platforms` and `remote.urls`. [official]

## Traps
1. The boundary is the window label, not the title. A window in several capabilities gets all their permissions combined. [official]
2. `remote.urls` opens commands to web pages: keep patterns tight. On Linux and Android an iframe looks like its window. [official]
3. Capabilities do not fix insecure Rust or broad scopes. Validate every command argument. [official]
4. CSP is active only when the `csp` key in `tauri.conf.json` is set. Avoid CDN scripts. [official]
5. Command rules: no `pub` on a command in `lib.rs`; only the last `invoke_handler` call counts; JS argument keys are camelCase; async commands cannot take borrowed arguments; errors must be serializable. [official]
6. Updater: signing cannot be turned off. Lose the private key and installed apps cannot update. Set `TAURI_SIGNING_PRIVATE_KEY` in the shell (a `.env` file is not read). `pubkey` is the key text, not a path. Never ship `dangerousInsecureTransportProtocol`. [official]
7. The built-in dev server is unencrypted and unauthenticated: use it on trusted networks only. [official]
8. The OS webview differs per platform, so test every target you ship. Linux needs the webkit2gtk-4.1 dev packages; Windows needs WebView2 and the C++ build tools. [official; test advice is reasoning]

## Checks
- `cargo clippy` (deny warnings: `CARGO_BUILD_WARNINGS=deny` on Cargo 1.97 or newer, else `-- -Dwarnings`) and `cargo test`. [official]
- `cargo audit` (Apache-2.0 or MIT; run only on projects you trust) and `npm audit`. [official]
- Frontend tests: `mockIPC` and `clearMocks` from `@tauri-apps/api/mocks`; call `clearMocks` after each test. WebDriver end-to-end tests run on Windows and Linux, not macOS. [official]
- Run the build for each target and open the app. Cargo checks do not see capability mistakes at run time. [reasoning]

## Done when
Clippy and tests pass, audits are read, every window label used has a capability file, the app was started and a command call was seen working (screenshot or log line), and unverified rows are listed.

## Vendor skills
Not looked at. Run `find-skills` before writing from memory.
