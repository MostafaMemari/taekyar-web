<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Taekyar

Persian (fa, RTL) corporate site + blog with an admin dashboard. Next.js 16 (App Router), React 19, Tailwind v4, Prisma 7 + PostgreSQL, shadcn/radix UI. Path alias `@/*` → repo root.

## Commands

- Dev: `npm run dev` (port **4500**, not 3000) · Lint: `npm run lint` (bare `eslint`, flat config) · Typecheck: `npx tsc --noEmit` (no npm script; must pass clean; run `npx next typegen` first after route changes)
- No test runner. Ad-hoc scripts run directly: `node --env-file=.env captcha-flow-test.mts` (PostgreSQL captcha + rate limiting), `node --env-file=.env slug-flow-test.mts`, `node --env-file=.env api-e2e-test.mts` (needs a dev server on `localhost:4500`). Only a reachable Postgres is required — there is no Redis.
- `prisma.config.ts` loads `.env` itself when present, so plain `npx prisma migrate dev` / `npx prisma db seed` work locally; on Vercel the env comes from project settings.
- `npm run build` runs `prisma generate && prisma migrate deploy && prisma db seed && next build` → requires a reachable Postgres (migrate deploy + seed are non-destructive/idempotent).
- `postinstall` runs `prisma generate`; re-run it after schema changes.
- Copy `.env.example` → `.env` (gitignored). Required: `DATABASE_URL`, `SESSION_SECRET`. `ADMIN_USERNAME`/`ADMIN_PASSWORD` seed the admin login; `R2_*` needed for media uploads; `NEXT_PUBLIC_API_BASE_URL` optionally points the frontend API client at an external backend (empty = same origin); `COMMENT_IP_PEPPER` optional (built-in default).
- Seed upserts the admin user + `SiteSettings` row (id 1); content seeding is commented out. Skips admin silently if `ADMIN_USERNAME`/`ADMIN_PASSWORD` are unset.

## Architecture

API-first: the frontend talks to business operations exclusively through REST endpoints; Server Actions for business logic are gone.

- `app/api/v1/**` — Route Handlers (thin): origin check → session check → Zod validation → service call → revalidation → JSON envelope. Response shape: `{ ok: true, data }` or `{ ok: false, error: { code, message?, fieldErrors? } }`.
- `server/services/*` — business logic (posts, pages, taxonomy, menus, faqs, comments, media, settings, auth, captcha, admin-bar, slug, sanitizer, normalization). No HTTP or React imports; portable to a future NestJS/Express backend.
- `server/repositories/*` — database access for CAPTCHA challenges (`CaptchaChallenge`) and rate-limit counters (`RateLimitCounter`).
- `server/config/*` — central Prisma client (`server/config/prisma.ts`) and env helpers. Prisma is never imported by client code.
- `server/security/*` — IP hashing (`client.ts`) and same-origin enforcement for mutating requests (`origin.ts`).
- `lib/api/*` — typed frontend API client (`client.ts` + `endpoints.ts`), uses `NEXT_PUBLIC_API_BASE_URL` (empty = same-origin), sends cookies with `credentials: "include"`, throws `ApiClientError` (status/code/fieldErrors).
- `lib/validation/*` — Zod schemas validating every API request body/query; services keep semantic checks and Persian field-error labels.
- `types/api.ts` — the shared API contract (inputs, results, DTOs). Import from here, not from services.
- Sessions: HMAC-signed cookie `taekyar_session` (`lib/session.ts`, scrypt password hashing); `proxy.ts` (Next 16 middleware) gates `/dashboard/*` and `/login`; API routes check `getSession()` and return 401 instead of redirecting.
- Blog content (posts/categories/tags/comments) is DB-backed via `lib/blog/*` over the central Prisma client (PrismaPg driver adapter). `Post.content` is Tiptap HTML (or legacy block JSON, converted by `lib/post-content.ts`); HTML is sanitized at save and again at render by `server/services/sanitizer.ts` (sanitize-html allowlist). Categories are hierarchical (`path`, nested route `blog/category/[...path]`); posts soft-delete via `deletedAt` → `dashboard/posts/trash`; comments are threaded with PENDING/APPROVED/REJECTED moderation.
- Captcha: `svg-captcha` renders SVG server-side (in `serverExternalPackages`, font `fonts/vazirmatn/Vazirmatn-Regular.ttf`); digits are Persian (۰-۹). Challenges are single-use rows in PostgreSQL keyed by the `tc_captcha` cookie and bound to a hashed client IP; atomic `DELETE ... RETURNING` prevents replay and concurrent verification; attempt/generation/login rate limiting uses atomic upserts on `RateLimitCounter` (`server/services/captcha.service.ts`). Expired rows are pruned on issuance.
- Media uploads go to Cloudflare R2 via `aws4fetch` (`server/services/media.service.ts`): images only (jpg/png/webp), magic-byte sniffing in addition to Content-Type, keys `uploads/YYYY/MM/<uuid>.<ext>`. `R2_PUBLIC_URL` is read into `next.config.ts` image config at startup — changing it requires a dev server restart.
- Contact form is client-side only (validation + `mailto:` builder in `lib/contact-submission.ts`) — no DB model or API route.
- Layouts: `app/(public)` is the public site, `app/dashboard` the admin; root layout sets `lang="fa" dir="rtl"`. Static site copy, labels, and nav live in `data/` (feature subfolders: `data/blog/`, `data/dashboard/`, …).

## Conventions

- Default to Server Components; add `"use client"` only with a real need. Do not assume older Next.js behavior — consult `node_modules/next/dist/docs/` for unfamiliar APIs.
- Static site copy, labels, and nav live in `data/` (feature subfolders: `data/blog/`, `data/dashboard/`, …) — never inline large datasets in JSX or duplicate them across components. Business logic goes in `server/services/`; client-safe helpers in `lib/`; reusable hooks in `hooks/`, never inside component folders.
- Client components never import from `server/` or Prisma — they call `lib/api` endpoints. Server-side mutations live only in services, invoked by API routes.
- Reuse `components/ui` primitives (shadcn radix-nova, rtl: true). Preserve Persian RTL behavior everywhere; digits in captcha are Persian (۰-۹).
- Extract reusable/large SVGs into their own files or components; never inline large icon definitions in page/section components.

# Strict Code Comment Policy

**DO NOT ADD COMMENTS UNLESS EXPLICITLY REQUESTED.** No `//`, `/* */`, `/** JSDoc */`, or JSX `{/* ... */}` comments — not even explanatory ones. Zero comments is the default.
