# Inventory & Invoice App — Documentation

## Overview

This is a full-featured Inventory & Invoice Management web application built with Next.js (App Router) and TypeScript. It provides dashboard analytics, product/customer management, invoice generation, stock tracking, CSV bulk import, and store settings.

## Tech Stack

- Framework: Next.js (App Router, server components + client components)
- Language: TypeScript
- UI: shadcn/ui + Radix primitives + Tailwind CSS
- Charts: Recharts
- State / Utilities: `lib/store.ts`, `lib/utils.ts`, `zod`, `react-hook-form`
- Icons: Lucide React
- Package manager: pnpm (used in this workspace)

Current notable dependency versions (after recent upgrade): Next 16.x, React 19.x, Tailwind CSS 4.x.

## Project Structure (high level)

- `app/` — Next.js App Router pages, layouts and nested routes. Key routes:
  - `/` — landing page
  - `/dashboard` — authenticated app area with nested routes: `products`, `invoices`, `customers`, `stock`, `import`, `reports`, `settings`, `docs`
- `components/` — UI components grouped by feature (dashboard, products, invoices, customers, stock, import, settings) and `ui/` for shared shadcn components
- `lib/` — small application utilities and a client-side store (`store.ts`) and types (`types.ts`)
- `hooks/` — custom React hooks used across the app
- `public/` — static assets
- `styles/` — global Tailwind CSS styles

## Important files

- `package.json` — scripts and dependencies
- `next.config.mjs` — Next.js configuration
- `app/layout.tsx` and `app/dashboard/layout.tsx` — top-level layouts and providers
- `components/dashboard/sidebar.tsx` — navigation for the app
- `lib/store.ts` — simple data store used by the UI (inspect for persistence and hydration behavior)

## Scripts

- `pnpm dev` — run development server
- `pnpm build` — production build
- `pnpm start` — start production server after build
- `pnpm lint` — lint project (may require adding ESLint devDependency; see notes)

## Development: setup and run

1. Install dependencies (pnpm is recommended):

```bash
pnpm install
```

2. Run dev server:

```bash
pnpm dev
```

3. Build for production:

```bash
pnpm build
pnpm start
```

## Known issues & notes discovered during upgrade

- Build succeeded after upgrading packages to Next 16 and React 19. Static pages generated correctly.
- Recharts emitted warnings during build: "width(-1) and height(-1) of chart should be greater than 0" — caused by chart containers rendering before dimensions are available. Fix by ensuring container styles provide explicit sizing (`min-width`/`min-height`) or use `ResponsiveContainer` with parent that has fixed height.
- `eslint` was not available in devDependencies, so `pnpm lint` failed with `eslint: command not found`. Consider adding `eslint` and `eslint-config-next` or your preferred configuration.
- `sharp` build scripts were ignored by pnpm; if you rely on `sharp` (image processing), run `pnpm approve-builds` to permit native build scripts.

## Typical change areas

- Modifying forms: `components/*-form.tsx` and `react-hook-form` usage; update resolvers if you change validation schema.
- Data model changes: update `lib/types.ts` and any server endpoints you introduce.
- CSV import: `components/import/bulk-import.tsx` — verify CSV columns and mapping.

## Upgrading Next / React

- When upgrading Next/React, check the following:
  - `app/` usage with server and client components (add `'use client'` at top of client components)
  - Any usage of `next/image` or image handling that may require `sharp` or adapter changes
  - Third-party components that assume browser globals during SSR — wrap with dynamic imports or `'use client'`

## Recommended Backend Options (short)

This is a frontend-first Next.js app; it currently does not include a dedicated backend in this repository. For a long-term backend, two strong options are:

- Node.js (TypeScript) — use NestJS or Express + Prisma + PostgreSQL. Pros: fast developer velocity, shared TypeScript types between frontend and backend, easy integration with Next.js, large ecosystem. Good default for this stack.
- Java — use Spring Boot + JPA/Hibernate + PostgreSQL. Pros: excellent for large enterprise systems, mature tooling, strong concurrency and stability. Consider when you need JVM ecosystem, strict enterprise constraints, or existing Java teams.

Recommendation: prefer a Node.js + TypeScript backend for this project unless you have specific enterprise requirements or existing Java infrastructure.

## Next actionable steps (suggested)

- Add `eslint` devDependency and run linting to surface issues.
- Fix Recharts container sizing by giving the chart container an explicit height or using layout-aware wrappers.
- If you want a backend scaffold, I can create a starter NestJS + Prisma project (TypeScript) and wire up a few API endpoints for products, customers, and invoices.

---

Document created by automated repository analysis. If you want I can expand any section or scaffold the backend you prefer.
