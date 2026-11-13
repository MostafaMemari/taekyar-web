<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Taekyar

Persian (fa, RTL) corporate site + blog with an admin dashboard. Next.js 16 (App Router), React 19, Tailwind v4, Prisma 7 + PostgreSQL, shadcn/radix UI. Path alias `@/*` → repo root.

## Commands

- Dev: `npm run dev` (port **4500**, not 3000) · Lint: `npm run lint` (bare `eslint`, flat config) · Typecheck: `npx tsc --noEmit` (no npm script; must pass clean)
- No test runner. Ad-hoc scripts run directly against the dev database: `node --env-file=.env captcha-flow-test.mts` (captcha flow, needs Postgres), `node --env-file=.env slug-flow-test.mts` (slugs, needs Postgres), `node --env-file=.env e2e-captcha-check.mts` (login e2e, needs two dev servers on ports 3100/3101).
- Prisma CLI does NOT auto-load `.env` (fails with `PrismaConfigEnvError`). Prefix every `prisma` command with `set -a && source .env && set +a`, e.g. `npx prisma migrate dev` or `npx prisma db seed` (`prisma.config.ts` seed is bare `node prisma/seed.ts`, so it needs the prefix too).
- `npm run build` runs `prisma generate && prisma migrate deploy && prisma db seed && next build` → requires a reachable Postgres AND the env prefix above, or build fails.
- `postinstall` runs `prisma generate`; re-run it after schema changes.
- Copy `.env.example` → `.env` (gitignored). Required: `DATABASE_URL`, `SESSION_SECRET`. `ADMIN_USERNAME`/`ADMIN_PASSWORD` seed the admin login; `R2_*` needed for media uploads; `COMMENT_IP_PEPPER` optional (built-in default).
- Seed upserts the admin user + `SiteSettings` row (id 1); content seeding is commented out. Skips admin silently if `ADMIN_USERNAME`/`ADMIN_PASSWORD` are unset.

## Architecture

- `proxy.ts` (Next 16's middleware) gates `/dashboard/*` and `/login` on the session cookie (`taekyar_session`, HMAC-signed with `SESSION_SECRET`, scrypt password hashing in `lib/auth/session.ts`); login Server Actions in `lib/admin/auth-actions.ts`.
- Mutations are Server Actions: `lib/admin/*-actions.ts` (posts, taxonomy, comments, media, images, auth; barrel `lib/admin-actions.ts`) and `lib/comments/*` (public comments: submit + client builder + IP hashing). The only API route is `app/api/captcha/image`.
- Blog content (posts/categories/tags/comments) is DB-backed via `lib/blog/*` over `lib/prisma.ts` (PrismaPg driver adapter). `Post.content` is Tiptap HTML (or legacy block JSON, converted and sanitized by `lib/blog/post-content.ts`). Categories are hierarchical (`path`, nested route `blog/category/[...path]`); posts soft-delete via `deletedAt` → `dashboard/posts/trash`; comments are threaded with PENDING/APPROVED/REJECTED moderation.
- Captcha: `svg-captcha` renders SVG server-side (in `serverExternalPackages`, font `lib/captcha-fonts/Vazirmatn-Regular.ttf`); challenge digits are Persian (۰-۹). Challenges are single-use, stored in PostgreSQL (`CaptchaChallenge`, keyed by the `tc_captcha` cookie, bound to a hashed client IP, consumed atomically via `usedAt`); attempt/generation rate limiting is DB-backed via `RateLimitCounter` (`lib/captcha/` folder). Expired rows are lazily cleaned on each challenge creation.
- No Redis anywhere — captcha state and rate counters live in PostgreSQL.
- Media uploads go to Cloudflare R2 via `aws4fetch` (`lib/media/r2.ts`): images only (jpg/png/webp), keys `uploads/YYYY/MM/<uuid>.<ext>`. `R2_PUBLIC_URL` is read into `next.config.ts` image config at startup — changing it requires a dev server restart.
- Contact form is client-side only (validation + `mailto:` builder in `lib/contact-submission.ts`) — no DB model or API route.
- Layouts: `app/(public)` is the public site, `app/dashboard` the admin; root layout sets `lang="fa" dir="rtl"`. Static site copy, labels, and nav live in `data/` (feature subfolders: `data/blog/`, `data/dashboard/`, …).

## Conventions

- Default to Server Components; add `"use client"` only with a real need. Do not assume older Next.js behavior — consult `node_modules/next/dist/docs/` for unfamiliar APIs.
- Static site copy, labels, and nav live in `data/` (feature subfolders: `data/blog/`, `data/dashboard/`, …) — never inline large datasets in JSX or duplicate them across components. Business logic goes in `lib/`; reusable hooks go in `hooks/`, never inside component folders.
- Reuse `components/ui` primitives (shadcn radix-nova, rtl: true). Preserve Persian RTL behavior everywhere; digits in captcha are Persian (۰-۹).
- Extract reusable/large SVGs into their own files or components; never inline large icon definitions in page/section components.

# Strict Code Comment Policy

**DO NOT ADD COMMENTS UNLESS EXPLICITLY REQUESTED.** No `//`, `/* */`, `/** JSDoc */`, or JSX `{/* ... */}` comments — not even explanatory ones. Zero comments is the default.
