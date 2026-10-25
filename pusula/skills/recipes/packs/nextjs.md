# Pack: Next.js

Read when the task touches a Next.js project. Facts read 2026-10-25 on the pages named. Labels: [official], [reasoning], [unverified].

## Sources first
- The project's own docs win: `create-next-app` projects ship `AGENTS.md` and the docs for the installed version in `node_modules/next/dist/docs/`. Read those before the website. [official]
- Website: https://nextjs.org/docs (index for agents: https://nextjs.org/docs/llms.txt). Pages used: /docs/app/getting-started/installation, /docs/app/guides/data-security, /docs/app/getting-started/mutating-data, /docs/app/guides/upgrading.
- As read: latest stable 16.4.3 (23 Oct); minimum Node.js 20.9; minimum TypeScript 5.1.0; Turbopack is the default bundler (`--webpack` to opt out). [official]
- Upgrades: the `next upgrade` command of the installed package; version guides for 14, 15 and 16; codemods from `@next/codemod` (pin its version before running). [official]

## Traps
1. A Server Action is a public POST endpoint, even if the page that uses it is protected. Check authentication **and** ownership inside every action. A page-level redirect does not cover it. [official]
2. Validate every input again on the server (form data, params, headers, `searchParams`). Never trust `searchParams` for roles. [official]
3. Return only what the UI needs from an action; do not return raw database rows. [official]
4. Keep database access and `process.env` secrets in one `server-only` data layer. Only `NEXT_PUBLIC_` variables reach the browser. Do not pass whole records into `'use client'` components. [official]
5. Choose one data-fetching style (HTTP APIs, a data access layer, or component-level) and do not mix. [official]
6. Do not run mutations during render (no cookie or cache changes in a Server Component). [official]
7. `proxy.ts` and `route.ts` handlers are powerful: audit them with ordinary web-security methods. Folder names in brackets are user input. [official]
8. Since Next.js 16 `next build` does not run the linter. Run lint yourself (`eslint` or Biome); `next lint` moved to the ESLint CLI via a codemod. [official]
9. Behind a proxy or on several servers: set `serverActions.allowedOrigins` and a shared `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`. [official]
10. Forms must show pending, success and error states (`useActionState` gives `pending`). Empty and loading states too (`AGENTS.md` UI rule). [official + project rule]

## Checks
- `npm run lint`, the local `tsc --noEmit`, `npm run build` (our T21 run also used `next typegen` before `tsc`). Read the warnings, not just the exit code.
- Start the production server (`next start`) and call the real route; take screenshots of every form state (`ui-acceptance`).
- Audit list from the data-security page: data layer isolated; props of client components narrow; every `use server` file re-authorizes and checks ownership; bracket params validated; `proxy.ts`/`route.ts` reviewed. [official]
- `pusula_check.py --only sast,secrets,deps`.

## Done when
Lint, types and build pass, the form was submitted for real with success, error and pending states seen, authorization is inside the action, and text, colors and limits live in config or tokens.

## Vendor skills
The project's `AGENTS.md` plus the bundled docs are the vendor guidance. Other skills: `find-skills`, not installed without a scan and a yes.
