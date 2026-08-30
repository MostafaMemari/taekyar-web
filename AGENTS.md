<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Taekyar

Persian (fa, RTL) corporate site + blog with an admin dashboard. Next.js 16 (App Router), React 19, Tailwind v4, Prisma 7 + PostgreSQL, shadcn/radix UI. Path alias `@/*` → repo root.

## Commands

- Dev: `npm run dev` · Build: `npm run build` · Lint: `npm run lint` (runs bare `eslint` with flat config)
- Typecheck: `npx tsc --noEmit` (no npm script; must pass clean)
- Only test (captcha flow): `node captcha-flow-test.mts`
- Prisma CLI does NOT auto-load `.env`. Prefix DB commands with `set -a && source .env && set +a` (bash), e.g. for `npx prisma migrate dev`. Seed is the exception: `npx prisma db seed` runs `node --env-file=.env prisma/seed.ts` via `prisma.config.ts`.
- Run `npx prisma generate` after schema changes or fresh install (no postinstall hook).
- Copy `.env.example` → `.env` (gitignored).

## Architecture

- `proxy.ts` (Next 16's middleware) gates `/dashboard/*` and `/login` on the session cookie; sessions in `lib/session.ts`, auth actions in `lib/admin/auth-actions.ts`.
- Mutations are Server Actions in `lib/admin/*-actions.ts` and `lib/comment-actions.ts`. The only API route is `app/api/captcha/image`.
- Blog content (posts/categories/tags/comments) is DB-backed via `lib/blog/*` and `lib/prisma.ts` (PrismaPg driver adapter). Static site copy, labels, and nav live in `data/` (feature subfolders: `data/blog/`, `data/dashboard/`, …).
- Captcha images are rendered server-side with `@napi-rs/canvas` (kept in `serverExternalPackages`) using `lib/captcha-fonts/Vazirmatn-Regular.ttf`; answers use Persian digits (۰-۹). Captcha/rate-limit/IP-hash logic lives in `lib/comment-*.ts`; `COMMENT_IP_PEPPER` is optional with a built-in default.
- Media uploads go to Cloudflare R2 via `aws4fetch` (`lib/r2.ts`). `R2_PUBLIC_URL` is read into `next.config.ts` image config at startup — changing it requires a dev server restart.
- Layouts: `app/(public)` is the public site; root layout sets `lang="fa" dir="rtl"`.

## Conventions

- Inspect existing code first; follow its patterns. Reuse components, hooks, and utilities before creating new ones. No new dependencies without clear justification. Do not over-engineer.
- One clear responsibility per component and hook. Extract sections instead of building monolithic components; prefer composition over prop-driven sprawl.
- Components should not contain large static datasets, business logic, data fetching, complex state, large SVGs, or config objects — move those to `data/`, `lib/`, or dedicated files.
- Reusable hooks go in `hooks/` (e.g. `use-reading-progress.ts`), never inside component folders; feature-specific hooks may live near their feature.
- Avoid `useEffect` for derived state; prefer derived values. Avoid `any` and unsafe casts; type API responses and keep types near ownership.
- Static data belongs in `data.ts`/`constants.ts`/`config.ts` files, not inline in JSX. Feature-specific data stays with the feature; shared data goes in the shared location. Never duplicate the same static data across components.
- Do not add `"use client"` without a real need — default to Server Components. Do not assume behavior from older Next.js versions; consult `node_modules/next/dist/docs/` for unfamiliar APIs.
- Follow the Taekyar design system: consistent spacing, typography, colors, radiuses, shadows, and interaction states. Reuse `components/ui` primitives (shadcn radix-nova, rtl: true). Preserve Persian RTL behavior everywhere.
- Extract reusable/large SVGs into their own files or components; never inline large icon definitions in page/section components.
- Move files only with all imports updated; check for an appropriate existing location first.

# Strict Code Comment Policy

**DO NOT ADD COMMENTS UNLESS EXPLICITLY REQUESTED.** No `//`, `/* */`, `/** JSDoc */`, or JSX `{/* ... */}` comments — not even explanatory ones. Zero comments is the default.
