<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Engineering Rules

## Core Principles

- Always inspect the existing codebase before making changes.
- Follow existing project patterns and conventions.
- Prefer simple, readable, maintainable solutions over clever abstractions.
- Reuse existing components, hooks, utilities, and installed packages whenever possible.
- Do not introduce new dependencies unless there is a clear and justified reason.
- Preserve existing functionality and UI unless the task explicitly requires changing them.
- Do not over-engineer.
- Do not create abstractions without a practical benefit.

## React Component Architecture

- Every component must have one clear responsibility.
- Keep components small, focused, readable, and composable.
- Avoid large monolithic components.
- Do not put multiple unrelated sections, behaviors, or responsibilities inside one component.
- Extract meaningful sections into focused components when needed.
- Prefer composition over large prop-driven components.
- Reuse existing components before creating new ones.
- Do not create unnecessary micro-components for trivial markup.
- If a component becomes difficult to understand or modify, refactor it.

### Component Responsibilities

A UI component should primarily handle presentation and composition.

Avoid putting all of these responsibilities inside one component:

- Large static datasets
- Business logic
- Data fetching
- Complex state management
- Multiple unrelated UI sections
- Large SVG definitions
- Configuration objects
- Utility/helper functions
- Unrelated side effects

When responsibilities grow, separate them into appropriate components, hooks, data files, or utilities.

## Hooks

- Each custom hook must have one clear responsibility.
- Avoid large "god hooks".
- Do not mix unrelated concerns inside one hook.
- Do not mix UI state, API calls, business logic, and unrelated effects in one hook.
- Avoid unnecessary `useEffect`.
- Never use `useEffect` for derived state.
- Prefer derived values over synchronization effects when possible.
- Reusable hooks belong in the appropriate `hooks/` location.
- Do not place reusable hooks inside component folders.
- A hook may live near a feature only when it is genuinely feature-specific.
- Reuse existing hooks before creating a new one.

## Separation of Concerns

Keep these concerns separated when appropriate:

- UI/presentation
- Data
- Business logic
- Data fetching
- State management
- Utilities
- Configuration
- Types

Do not mix large amounts of data or logic directly into JSX components.

## Static Data and Configuration

Static data must not unnecessarily live inside UI components.

Examples:

- Navigation items
- Social links
- FAQ items
- Blog data
- Categories
- Trust badges
- CTA content
- Configuration objects
- Reusable arrays
- Static labels used by multiple components

Use appropriate files such as:

- `data.ts`
- `constants.ts`
- `config.ts`

### Data Ownership

- Feature-specific data belongs to that feature.
- Shared/global data belongs in a shared data/constants location.
- Do not place static data files inside generic component folders unless the data is truly local to that component.
- Do not duplicate the same static data across multiple components.

## Project Folder Structure

Before creating or moving a file:

1. Inspect the current project structure.
2. Determine what kind of file it is.
3. Determine whether it is shared or feature-specific.
4. Check whether an appropriate existing location already exists.
5. Place it in the most appropriate existing location.
6. Update all imports after moving it.

### General Structure

- `components/` → UI components
- `hooks/` → reusable custom hooks
- `lib/` → utilities and shared helpers
- `data/` → shared/static data when appropriate
- `constants/` → shared constants/configuration when appropriate
- Feature folders → feature-specific UI, data, hooks, types, and utilities

Do not put unrelated file types together just because they are used by the same page.

Examples:

- `use-active-heading.ts` → hooks, not components
- `use-toast.ts` → hooks/utilities according to the project's architecture, not generic UI
- Blog-specific data → blog feature/data structure
- Large SVG/icon definitions → dedicated icon/component files when appropriate

## Feature Organization

Prefer feature-based organization when a feature has enough complexity to justify it.

A feature may contain:

- Components
- Data
- Hooks
- Types
- Utilities

Keep related code together, but maintain clear separation of responsibilities.

Do not create unnecessary deep nesting.

## TypeScript

- Avoid `any`.
- Do not hide type errors with unsafe casts.
- Prefer explicit and reusable types.
- Keep API responses properly typed.
- Reuse shared types where appropriate.
- Avoid unnecessary type complexity.
- Keep types close to their ownership unless they are genuinely shared.

## Next.js

- Respect Server Component and Client Component boundaries.
- Do not add `"use client"` without a clear reason.
- Follow existing Next.js project patterns.
- Use framework-native solutions whenever practical.
- Do not assume behavior from older Next.js versions.
- Before using unfamiliar Next.js APIs, inspect the installed Next.js documentation under `node_modules/next/dist/docs/`.
- Follow current deprecation notices and framework conventions.

## UI and Design System

- Follow the existing Taekyar design system and visual language.
- Reuse existing UI components and installed packages.
- Do not create duplicate UI primitives.
- Maintain consistent spacing, typography, colors, borders, radiuses, shadows, and interaction states.
- Preserve Persian RTL behavior.
- Keep responsive behavior consistent with the existing project.
- Prefer simple, polished UI over excessive visual effects.

## SVG and Large Static Definitions

- Do not place large SVG definitions directly inside large page/section components.
- Extract reusable SVGs/icons into appropriate files or components.
- Keep page and section components focused on composition.
- Do not combine UI, data, logic, and large icon definitions in one file.

# Strict Code Comment Policy

## Default Rule

**DO NOT ADD COMMENTS UNLESS EXPLICITLY REQUESTED.**

The default behavior for this project is:

**NO COMMENTS.**

This applies to:

- `// comments`
- `/* comments */`
- `/** JSDoc comments */`
- JSX comments such as `{/* ... */}`
- Descriptive block comments
- Explanatory comments
- Comments describing obvious UI or logic

### Forbidden Examples

Do NOT write comments like:

```ts
/** Page scroll progress as a 0..1 fraction. */
```
