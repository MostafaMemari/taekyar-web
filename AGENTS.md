<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Engineering Rules

## General Principles

- Always inspect the existing codebase before implementing changes.
- Follow existing project patterns and conventions.
- Prefer simple, maintainable solutions over clever abstractions.
- Reuse existing components, hooks, and utilities before creating new ones.

## React Component Architecture

- Keep components small and focused.
- Each component should have one clear responsibility.
- Avoid large monolithic components.
- Do not create files with many unrelated exported components.
- Prefer composition over complex prop-driven components.
- Extract meaningful UI sections into separate components.

## Hooks

- Keep custom hooks focused on a single responsibility.
- Avoid creating large "god hooks".
- Do not mix UI state, API calls, business logic, and unrelated effects in one hook.
- Avoid unnecessary useEffect.
- Do not use useEffect for derived state.

## Separation of Concerns

- Keep UI components focused on rendering.
- Keep business logic outside presentation components.
- Separate data fetching, state management, utilities, and domain logic when needed.

## TypeScript

- Avoid any.
- Do not hide type errors with unsafe casts.
- Prefer explicit and reusable types.
- Keep API responses properly typed.

## Next.js

- Respect Server Component and Client Component boundaries.
- Do not add "use client" without a clear reason.
- Follow existing project patterns for data fetching and mutations.
- Check Next.js documentation when using unfamiliar APIs.

## Before Coding

Before implementing any feature:

1. Inspect similar existing code.
2. Understand the current architecture.
3. Decide component boundaries.
4. Reuse existing solutions.

## Before Finishing

Review your implementation:

- Is any component too large?
- Are hooks doing too many things?
- Is there duplicated logic?
- Did you create unnecessary abstractions?
- Does this match the existing architecture?

The goal is not only working code.
The goal is maintainable production-quality code.
