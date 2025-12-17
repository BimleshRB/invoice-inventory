# Inventory & Invoice App — Summary & Quick Start

**What it is:** A Next.js + TypeScript app for inventory, invoices, customers, and stock management with CSV import and reports.

**Quick start**

```bash
pnpm install
pnpm dev
# or build
pnpm build
pnpm start
```

**Key folders**
- `app/` – routes + layouts
- `components/` – UI components
- `lib/` – utilities and types

**Current status after automated upgrade**
- Dependencies upgraded to Next 16.x and React 19.x. Build completed successfully.
- Linting currently fails because `eslint` isn't installed as a devDependency.
- Recharts warnings about negative chart sizes need layout fixes.

**Backend: Node.js or Java — which to choose?**

Short recommendation: Prefer Node.js (TypeScript) for this project unless you have enterprise constraints that favor Java.

Why Node.js (TypeScript)?
- Fast developer velocity and iteration.
- Share TypeScript types between frontend and backend.
- Excellent integration with Next.js (same runtime ecosystem).
- Large library ecosystem and easy hosting (Vercel, Docker, serverless, or self-host).

When to consider Java instead:
- You have strict enterprise requirements, existing Java infrastructure, or need heavy JVM-based integrations.
- You need mature transactional tooling and JVM performance characteristics at scale.

Recommended backend stacks
- Node.js (TypeScript): NestJS or Express + Prisma ORM + PostgreSQL, JWT or NextAuth for auth.
- Java: Spring Boot + JPA/Hibernate + PostgreSQL, use Liquibase/Flyway for migrations.

If you want, I can scaffold a starter backend (NestJS + Prisma) and wire up API endpoints for `products`, `customers`, and `invoices` so the frontend can consume them.
