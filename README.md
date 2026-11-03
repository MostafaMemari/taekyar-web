# Taekyar

Persian (fa, RTL) corporate site + blog with an admin dashboard for the Taekyar martial-arts platform. Built with Next.js 16 (App Router), React 19, Tailwind v4, Prisma 7 + PostgreSQL, and shadcn/radix UI.

## Architecture

API-first, single Next.js application:

```
Frontend (React/Server Components)
  → REST API  (app/api/v1, Route Handlers)
    → Services (server/services, business logic)
      → Prisma (server/config/prisma, PostgreSQL)
```

- All frontend business operations go through typed REST endpoints under `/api/v1` (`lib/api` client, `NEXT_PUBLIC_API_BASE_URL` optional).
- Consistent JSON envelope: `{ ok: true, data }` / `{ ok: false, error: { code, message?, fieldErrors? } }`.
- Zod validates every request; services keep business logic; repositories isolate CAPTCHA + rate-limit storage.
- Server Actions are not used for business operations. Components never touch Prisma.
- The service layer has no HTTP/React imports, so the backend can later be extracted to NestJS/Express by pointing `NEXT_PUBLIC_API_BASE_URL` at the new backend and reimplementing the same `/api/v1` contract.

CAPTCHA (SVG, Persian digits ۰-۹), login throttling, and comment rate limiting are all stored in PostgreSQL (atomic single-use deletes + upsert counters). There is no Redis dependency.

Media uploads go to Cloudflare R2 (images only, magic-byte validated, server-only credentials).

## Getting started

```bash
cp .env.example .env   # fill in DATABASE_URL, SESSION_SECRET, R2_*
npm install
npx prisma migrate deploy
npx prisma db seed     # creates the admin user + site settings
npm run dev            # http://localhost:4500
```

`prisma.config.ts` loads `.env` when present, so `prisma migrate dev` / `prisma db seed` work without exporting env vars manually.

## Verification

```bash
npm run lint
npx next typegen && npx tsc --noEmit
npm run build

set -a && source .env && set +a
node captcha-flow-test.mts   # captcha lifecycle, expiry, concurrency, rate limits (needs Postgres)
node slug-flow-test.mts      # slug resolution (needs Postgres)
node api-e2e-test.mts        # full REST API flow (needs Postgres + `npm run dev` on :4500)
```

## Dashboard

The admin dashboard at `/dashboard` covers posts (with Tiptap editor, SEO, per-post FAQs), hierarchical categories, tags, pages, menus, comment moderation, media (R2), homepage FAQs, and site settings. Sessions are HMAC-signed cookies (`taekyar_session`); `proxy.ts` gates `/dashboard/*`.
