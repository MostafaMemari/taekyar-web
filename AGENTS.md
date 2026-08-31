<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Taekyar

Persian (fa, RTL) corporate site + blog with an admin dashboard. Next.js 16 (App Router), React 19, Tailwind v4, Prisma 7 + PostgreSQL, Redis (ioredis), shadcn/radix UI. Path alias `@/*` → repo root.

## Commands

- Dev: `npm run dev` · Build: `npm run build` · Lint: `npm run lint` (bare `eslint` with flat config)
- Typecheck: `npx tsc --noEmit` (no npm script; must pass clean)
- Only test (captcha flow): `node --env-file=.env captcha-flow-test.mts` — needs a running Redis (`REDIS_URL`); without env it fails on the first Redis call
- Prisma CLI does NOT auto-load `.env` (fails with `PrismaConfigEnvError`). Prefix every `prisma` command with `set -a && source .env && set +a`, e.g. `npx prisma migrate dev` or `npx prisma db seed`.
- `npm run build` runs `prisma generate && prisma migrate deploy && prisma db seed && next build` → requires a reachable Postgres AND the env prefix above, or build fails.
- `postinstall` runs `prisma generate` (fresh install is covered); re-run it after schema changes.
- Copy `.env.example` → `.env` (gitignored). Required: `DATABASE_URL`, `SESSION_SECRET`, `REDIS_URL`. `ADMIN_USERNAME`/`ADMIN_PASSWORD` seed the admin login; `R2_*` needed for media uploads; `COMMENT_IP_PEPPER` optional (IP hashing has a built-in default).
- Seed only upserts the admin user (content seeding is commented out) and skips silently if `ADMIN_USERNAME`/`ADMIN_PASSWORD` are unset.

## Architecture

- `proxy.ts` (Next 16's middleware) gates `/dashboard/*` and `/login` on the session cookie (`taekyar_session`, HMAC-signed with `SESSION_SECRET`, scrypt password hashing in `lib/session.ts`); login Server Actions in `lib/admin/auth-actions.ts`.
- Mutations are Server Actions: `lib/admin/*-actions.ts` (posts, taxonomy, comments, media, images, auth; barrel `lib/admin-actions.ts`) and `lib/comment-actions.ts` (public comments). The only API route is `app/api/captcha/image`.
- Blog content (posts/categories/tags/comments) is DB-backed via `lib/blog/*` over `lib/prisma.ts` (PrismaPg driver adapter). `Post.content` is Tiptap HTML (or legacy block JSON, converted and sanitized by `lib/post-content.ts`). Categories are hierarchical (`path`, nested route `blog/category/[...path]`); posts soft-delete via `deletedAt` → `dashboard/posts/trash`; comments are threaded with PENDING/APPROVED/REJECTED moderation.
- Captcha: `svg-captcha` renders SVG server-side (in `serverExternalPackages`, font `lib/captcha-fonts/Vazirmatn-Regular.ttf`); challenge digits are Persian (۰-۹). Challenges are single-use, stored in Redis keyed by the `tc_captcha` cookie and bound to a hashed client IP; attempt/generation rate limiting is Redis-backed too (`lib/captcha.ts`, `lib/captcha-rate-limit.ts`, `lib/comment-security.ts`).
- Redis is required for captcha + comment rate limiting. If `REDIS_URL` is unset, `lib/redis.ts` returns a stub whose calls all reject — those flows fail at runtime (not at startup).
- Media uploads go to Cloudflare R2 via `aws4fetch` (`lib/r2.ts`): images only (jpg/png/webp), keys `uploads/YYYY/MM/<uuid>.<ext>`. `R2_PUBLIC_URL` is read into `next.config.ts` image config at startup — changing it requires a dev server restart.
- Contact form is client-side only (validation + `mailto:` builder in `lib/contact-submission.ts`) — no DB model or API route.
- Layouts: `app/(public)` is the public site, `app/dashboard` the admin; root layout sets `lang="fa" dir="rtl"`. Static site copy, labels, and nav live in `data/` (feature subfolders: `data/blog/`, `data/dashboard/`, …).

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
