# Stacks

Read when the `## Stack` section of `.pusula/architecture.md` is empty and you need a build, test or lint command, or when you start work on a stack you do not know. A section is added here only after it was checked against the official docs and its commands were run once.

## Any stack (also the ones not listed)
1. **Detect** from marker files: `package.json`, `Cargo.toml`, `pubspec.yaml`, `ProjectSettings/ProjectVersion.txt`, `*.csproj`, `go.mod`, `pyproject.toml`. Read the exact version the project uses.
2. **Look for agent docs first.** Many frameworks ship docs for agents (an `AGENTS.md` block, docs inside the package, or an `llms.txt` index). Read the page for the task, not the homepage (`source-driven-development`).
3. **Fill the Stack section**: commands to build, test, lint and type-check. Take them from the project's own scripts, Makefile or CI file first, the docs second. Add the official security guide and the platform's native analyzers.
4. **Run each command once.** Mark what you did not run `UNVERIFIED`.
5. Skills for the stack: `find-skills`. Libraries and tools: `source-driven-development`.

## Next.js (checked 2026-10-25 against nextjs.org/docs, v16.4; commands run on a fresh `create-next-app@16.4.3`)
Marker: `next` in `package.json`, or `next.config.*`.
- **Docs for agents:** `node_modules/next/dist/docs/` (16.2 and later). Read the matching guide before writing code: your training data may be older than the installed version. Not installed? `npm install`. Version 16.1 or older has no bundled docs: fetch the page as Markdown (add `.md` to its URL; index: https://nextjs.org/docs/llms.txt). Next's own `agents-md` codemod runs an unpinned `@canary` package: only with the user's yes.
- **Existing `AGENTS.md`:** `create-next-app` writes one with a managed block (`<!-- BEGIN:nextjs-agent-rules -->`); `next dev` re-adds it. Keep it. Claude Code 2.1 reads `AGENTS.md` itself (measured: no CLAUDE.md needed, and `@AGENTS.md` in `CLAUDE.md` does not load it twice); Codex reads it too.
- **Verify, in order:** `npm run lint` (the project's script; `next lint` is not in the 16.4 CLI reference), `npm exec --no-install -- next typegen`, `npm exec --no-install -- tsc --noEmit`, `npm run build`, then the project's tests. `--no-install` means "use the local copy, never download". Tests: Vitest or Jest for units, Playwright or Cypress end to end; for `async` Server Components prefer end to end ([guide](https://nextjs.org/docs/app/guides/testing)).
- **Structure:** a route is public only when it has `page` or `route`; other files in `app/` can sit beside it. `_folder` is private, `(group)` is not in the URL ([guide](https://nextjs.org/docs/app/getting-started/project-structure)).
- **States:** `loading.tsx`, `error.tsx` and `not-found.tsx` give the loading, error and empty states Pusula requires.
- **Layers:** `app/` (routes, UI) calls a `data/` access layer (`import 'server-only'`; checks the user; returns only the fields the UI needs), which calls the database. Pick one data approach and keep to it.
- **Security** ([official guide](https://nextjs.org/docs/app/guides/data-security)): validate all client input, including route params and `searchParams`. A page-level login check does not cover a Server Action: check the user and ownership inside each action. Return only what the UI needs. `NEXT_PUBLIC_` variables go to the browser. Audit `proxy.ts` and `route.ts` extra.
- **Not on by default:** the dev server's MCP endpoint `/_next/mcp`, and Next.js agent feedback (experimental, opt-in).
