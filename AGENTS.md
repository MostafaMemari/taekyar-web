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
- Reuse existing components, hooks, utilities, and installed packages before creating new ones.
- Do not introduce new dependencies unless there is a clear and justified need.
- Preserve existing functionality and design unless the task explicitly requires changing them.

## React Component Architecture

- Keep components small and focused.
- Each component must have one clear responsibility.
- Avoid large monolithic components.
- Do not create files with many unrelated exported components.
- Prefer composition over complex prop-driven components.
- Extract meaningful UI sections into separate components.
- Do not split components into meaningless tiny components just for the sake of having smaller files.
- If a component becomes difficult to understand or contains multiple responsibilities, refactor it.
- Reuse existing components before creating new ones.

## Component Responsibilities

A component should primarily be responsible for UI composition and presentation.

Avoid putting all of the following inside a single component:

- Large static datasets
- Business logic
- Data fetching
- Complex state management
- Multiple unrelated UI sections
- Large SVG definitions
- Configuration objects
- Utility functions

If a component handles multiple unrelated responsibilities, separate them into focused components, hooks, utilities, or data files.

## Hooks

- Keep custom hooks focused on a single responsibility.
- Avoid creating large "god hooks".
- Do not mix UI state, API calls, business logic, and unrelated effects in one hook.
- Avoid unnecessary `useEffect`.
- Do not use `useEffect` for derived state.
- Reusable hooks belong in the appropriate `hooks/` location.
- Do not place reusable hooks inside component folders unless they are strictly local to that component.
- Prefer existing hooks and utilities when available.

## Separation of Concerns

- Keep UI components focused on rendering.
- Keep business logic outside presentation components.
- Separate data fetching, state management, utilities, and domain logic when needed.
- Keep static content and configuration separate from UI components.
- Do not mix large amounts of content/data with JSX.

## Static Data and Configuration

Static data must not unnecessarily live inside UI components.

Examples include:

- Navigation items
- Social links
- FAQ items
- Blog mock data
- Trust badges
- Categories
- Configuration objects
- Reusable content arrays

Keep them in appropriate files such as:

- `data.ts`
- `constants.ts`
- `config.ts`

The location must match ownership:

- Feature-specific data → inside that feature.
- Shared/global data → shared data/constants location.
- Do not place data files inside a component folder unless the data is truly local to that component.

## Project Folder Structure

Before creating or moving files:

1. Inspect the existing project structure.
2. Identify whether the file is a component, hook, utility, data file, configuration, or feature-specific module.
3. Place it in the most appropriate existing location.
4. Follow the project's established architecture.

General rules:

- `components/` → UI components.
- `hooks/` → reusable custom hooks.
- `lib/` → utilities, helpers, and shared logic.
- `data/` or `constants/` → shared static data/configuration.
- Feature-specific folders → feature-specific components, data, hooks, and logic.

Do not put unrelated file types together just because they are used by the same page.

Examples:

- `use-active-heading.ts` belongs in an appropriate hooks location, not inside a generic component folder.
- `use-toast.ts` belongs with hooks/utilities according to the existing architecture, not as a generic UI component.
- Blog-specific data should live with the blog feature/data structure rather than inside a component file.

## Feature Organization

Prefer feature-based organization when a feature becomes large.

A feature may contain:

- Components
- Data
- Hooks
- Types
- Utilities

Keep related code together while maintaining clear separation of responsibilities.

Do not create deeply nested folders without a practical reason.

## TypeScript

- Avoid `any`.
- Do not hide type errors with unsafe casts.
- Prefer explicit and reusable types.
- Keep API responses properly typed.
- Avoid unnecessary type complexity.
- Reuse shared types where appropriate.

## Next.js

- Respect Server Component and Client Component boundaries.
- Do not add `"use client"` without a clear reason.
- Follow existing project patterns for data fetching and mutations.
- Check the installed Next.js documentation when using unfamiliar or changed APIs.
- Never assume an API behaves like an older Next.js version.
- Prefer framework-native solutions over unnecessary custom implementations.

## UI and Design System

- Follow the existing design system and visual language.
- Reuse existing UI components and installed packages.
- Do not create duplicate components that already exist.
- Do not introduce inconsistent spacing, colors, typography, radiuses, or interaction patterns.
- Preserve RTL and Persian UX requirements.
- Prefer simple, polished UI over unnecessary visual complexity.

## Code Comments

Do not add unnecessary comments.

Avoid comments that only describe obvious code or UI structure.

Forbidden examples:

```ts
/** Curated evergreen training guides, surfaced in the article sidebar. */
```
