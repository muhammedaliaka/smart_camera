---
name: ui-acceptance
description: Use before building or changing any UI and before calling it done. Writes testable acceptance criteria first, then judges screenshots of the running UI against each one.
license: MIT
---

# UI acceptance

Pusula's own skill. A UI nobody looked at is not verified. "Looks fine" and a code read are not evidence.

## 1. Criteria before code
Get the reference first (screenshot, game or site). No reference yet: your first reply asks for it and offers two described options; build nothing until it comes. If the user said they cannot answer now, pick one option, write it down as an assumption, and go on. Write the criteria to the task's plan or `.pusula/<task>/ui-criteria.md` before you build. Each one is numbered and can be judged from a screenshot or a measurement. Use the groups that apply; do not pad.

| Group | What to pin down |
|---|---|
| Layout | What sits where at each supported size and aspect ratio. Ask for the size list if unknown. Safe areas and notches. |
| States | Default, focus or hover, pressed, disabled, empty, loading, error, very long text, missing data. |
| Text | Every string comes from a key or localization table. The longest translation still fits. |
| Color and spacing | Values come from design tokens, no literals: color, type scale, spacing and motion (durations, easing). Text contrast 4.5:1, large text (18 pt, or 14 pt bold) 3:1, UI parts and icons 3:1 (WCAG 2.2, 1.4.3 and 1.4.11, read at w3.org on 2026-10-22). The project's own tokens win when they are stricter. |
| Input | Touch targets at least 24 by 24 CSS px (WCAG 2.2, 2.5.8) or the platform's larger guide. Keyboard, gamepad or touch focus order. |

Criteria written after the screenshot do not count. If you change one later, say so and why.

## 2. Build
Tokens and keys only (AGENTS.md code rules). Build the empty, loading and error states with the default state, not later. A static web page must open by double-click (`file://`): classic `<script>` tags, no ES modules, no `fetch()` of local files, unless the project already runs a server.

## 3. Look at it
Run the real UI. Capture one screenshot per target size and per listed state, saved under `.pusula/<task>/shots/` (not a shared temp folder). Describe what the image shows, not what the code intends.

Find a capture path before you give up, in this order:
1. The project's own script or test config (package.json scripts, a Playwright config).
2. A headless browser already on the machine: read `$PLAYWRIGHT_BROWSERS_PATH`, run `npx --no-install playwright --version`, look for a `chromium` or `chrome` binary. If Playwright answers, `npx --no-install playwright screenshot --viewport-size=360,800 file:///abs/path/index.html out.png` captures a static page.
3. Installing a browser or package needs the user's approval (`.pusula/permissions.md`).

Nothing works: say "UI not seen", list what you tried, and ask.

Judge line by line:

| ID | Result (pass, fail, not seen) | What the screenshot shows |
|---|---|---|

Done only when every row is pass, or reported as not seen. Never crop out a problem area.

## Where to look (check what the project has)
- **Unity:** Game view capture in play mode at each Game view resolution. Check Canvas Scaler mode, anchors, safe area, text keys, theme asset for colors, EventSystem navigation.
- **Web:** headless-browser screenshots at each width.
- **Tauri:** the app uses the system webview, which can differ from Chromium. A Chromium screenshot is a first check, not the final one.
- **Flutter:** emulator or device screenshots, plus large text scale.

## Report
Use `plain-explain`: result first, what you saw, what you did not see. A table of the rows above is enough.
