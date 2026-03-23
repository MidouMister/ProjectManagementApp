# AGENTS.md — PMA Implementation Bible

> **Version:** 4.2.0 · **Updated:** March 2026
> This file is the single source of truth for all agents. Read it fully before every task.

---

## 1. Build, Lint & Test Commands

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | Start development server (Turbopack) |
| `pnpm build`       | Production build                     |
| `pnpm start`       | Start production server              |
| `pnpm lint`        | Run ESLint on entire project         |
| `pnpm lint --fix`  | Auto-fix ESLint issues               |
| `pnpm lint [file]` | Lint specific file                   |
| `pnpm typecheck`   | TypeScript type checking only        |
| `pnpm format`      | Format all files with Prettier       |

> **Package Manager:** This project uses **pnpm**. Do NOT use npm or yarn.

---

## 2. Code Style Guidelines

### Imports

```typescript
// Order: external libs → internal modules → relative paths
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { createProject } from "@/lib/queries";
import styles from "./styles.module.css";
```

### TypeScript

- **NEVER use `any`** — always use proper types
- Define shared types in `src/lib/types.ts`
- Use interfaces for objects, types for unions/primitives
- Enable `strict: true` in tsconfig.json

```typescript
// Good
interface Project { id: string; name: string }
type ProjectStatus = 'New' | 'InProgress' | 'Complete'

// Bad
const project: any = { ... }
```

### Naming Conventions

| Element             | Convention  | Example           |
| ------------------- | ----------- | ----------------- |
| Files (components)  | PascalCase  | `ProjectCard.tsx` |
| Files (utilities)   | camelCase   | `formatDate.ts`   |
| Functions/Variables | camelCase   | `createProject()` |
| Components          | PascalCase  | `ProjectCard`     |
| Constants           | UPPER_SNAKE | `MAX_FILE_SIZE`   |
| Enums               | PascalCase  | `ProjectStatus`   |
| CSS classes         | kebab-case  | `.project-card`   |

### React Patterns

- Use **function components** only — no class components
- Mark client components with `'use client'` at top of file
- Use **Server Components** by default (no `'use client'`)
- Keep components small (< 200 lines)
- Extract reusable logic to custom hooks in `src/hooks/`
- Use **React Hook Form** + **Zod** for forms

### Error Handling

```typescript
// Good: typed error results
type Result<T> = { success: true; data: T } | { success: false; error: string };
function createProject(data: ProjectInput): Promise<Result<Project>> {
  if (!validate(data)) return { success: false, error: "INVALID_DATA" };
  // ...
}

// Bad: throwing exceptions
function createProject(data: ProjectInput): Promise<Project> {
  throw new Error("Invalid data");
}
```

- Display errors with toast notifications, not `alert()`
- Server Actions: always use `'use server'` directive
- Validate input with Zod schemas
- Return typed results (never throw for flow control)
- Call `revalidateTag()` after mutations

### CSS & Styling

- Use **Tailwind CSS** for all styling
- Use design tokens from `docs/design-system-v2.md`
- Prefer utility classes over custom CSS
- Use `cn()` utility for conditional classes

### Git Conventions

- Use **conventional commits**: `feat:`, `fix:`, `docs:`, `refactor:`
- Keep commits atomic and small
- Write descriptive commit messages (50 chars max for title)
- Example: `feat(projects): add budget validation to phase creation`

---

## 3. Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Protected routes
│   ├── api/               # API routes
│   ├── globals.css         # Tailwind + design tokens
│   └── layout.tsx         # Root layout
├── components/
│   ├── forms/             # All forms live here
│   ├── global/             # CustomModal, CustomSheet
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── queries.ts         # ALL Server Actions & DB queries (SSOT)
│   ├── types.ts           # ALL TypeScript types (SSOT)
│   ├── cache.ts           # Cache tags & profiles (SSOT)
│   ├── utils.ts           # cn(), formatAmount(), formatDate()
│   └── db.ts              # Prisma singleton
├── hooks/                  # Custom React hooks
└── providers/              # Context providers
```

### Single Source of Truth (SSOT) Files

| File                       | Rule                                  |
| -------------------------- | ------------------------------------- |
| `src/lib/queries.ts`       | ALL DB queries and Server Actions     |
| `src/lib/types.ts`         | ALL TypeScript interfaces and enums   |
| `src/lib/cache.ts`         | ALL cache tags and cacheLife profiles |
| `src/lib/utils.ts`         | Formatting functions                  |
| `src/prisma/schema.prisma` | ALL data models                       |

---

## 4. Data Model Enums

| Enum                 | Values                                              |
| -------------------- | --------------------------------------------------- |
| `Role`               | `OWNER`, `ADMIN`, `USER`                            |
| `SubscriptionStatus` | `TRIAL`, `ACTIVE`, `GRACE`, `READONLY`, `SUSPENDED` |
| `ProjectStatus`      | `New`, `InProgress`, `Pause`, `Complete`            |
| `PhaseStatus`        | `TODO`, `IN_PROGRESS`, `COMPLETE`                   |
| `SubPhaseStatus`     | `TODO`, `COMPLETED`                                 |
| `InvitationStatus`   | `PENDING`, `ACCEPTED`, `REJECTED`, `EXPIRED`        |

---

## 5. Key Business Rules

- **Tenant Isolation:** Every query must include `companyId` in the `where` clause
- **RBAC:** Enforce at both UI layer AND Server Action layer
- **Phase budget:** Sum of `Phase.montantHT` must NOT exceed `Project.montantHT` — hard block with error
- **Production:** `mntProd = Phase.montantHT × (taux / 100)` — always calculate server-side
- **Monetary format:** Use `formatAmount()` — display as `1 234 567,89 DA`
- **Date format:** Use `formatDate()` — display as `DD MMM YYYY`
- **UI Design (MANDATORY):** ALWAYS synchronize with **Stitch MCP** for all UI frontend work. Every component, page, form, and layout must strictly follow the architectural designs, color tokens (`#1E3A8A` navy), and "No-Line" surface philosophy defined in the **ProjectManagementApp** (ID: `4036095574208953106`) Stitch project.
- **Language (MANDATORY):** The application is in **French (fr)**. All buttons, labels, error messages, placeholders, and tooltips MUST be written in French.

---

## 6. Component & File Conventions

### Forms

- All forms in `src/components/forms/`
- Use React Hook Form + Zod validation
- Form submission calls Server Action directly
- Loading state: disable submit button during submission

### Modals & Sheets

- `CustomModal` — confirmations, short forms
- `CustomSheet` — detail views (480px width, slides from right)

### Design System

| Element         | Value                                       |
| --------------- | ------------------------------------------- |
| Font            | **DM Sans** (Google Fonts)                  |
| Page background | `#ECEAE8`                                   |
| Card background | `#FFFFFF` with `border: 1px solid #E8E7E5`  |
| Primary CTA     | `#111111` (black) with white text           |
| Border radius   | 8px buttons, 10px cards, 14px sidebar items |
| Language        | `lang="fr"` (French)                        |

---

## 7. Tech Stack

| Technology     | Purpose                               | Status            |
| -------------- | ------------------------------------- | ----------------- |
| Next.js 16     | App Router, Turbopack, Server Actions | ✅ Installed      |
| React 19       | UI rendering                          | ✅ Installed      |
| Tailwind CSS 4 | Styling                               | ✅ Installed      |
| shadcn/ui      | Component primitives                  | ✅ Partial        |
| Prisma 7       | ORM                                   | ✅ Schema ready   |
| Clerk          | Authentication                        | 🚧 Not installed  |
| Supabase       | Database + Realtime                   | 🚧 Not configured |

---

## 8. Prisma 7 Rules

- Schema location: `src/prisma/schema.prisma`
- Generator output: `src/generated/prisma/` (Prisma 7 pattern)
- Never use `new PrismaClient()` directly — import singleton from `src/lib/db.ts`
- Use `@prisma/adapter-pg` with `PrismaPg` for PostgreSQL
- All queries in `src/lib/queries.ts`
- Migrations: `pnpm exec prisma migrate dev --name <description>`
- Generate client: `pnpm exec prisma generate`
- Use `DATABASE_URL` for runtime, `DIRECT_URL` for migrations only

### Prisma 7 Singleton Pattern (`src/lib/db.ts`)

```typescript
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

---

## 9. Open Issues

| Issue                                               | Status                |
| --------------------------------------------------- | --------------------- |
| `formatAmount()` and `formatDate()` not in utils.ts | ✅ Fixed              |
| Prisma schema in `src/prisma/schema.prisma`         | ✅ Done (placeholder) |
| ClerkProvider not in layout                         | 🚧 M02                |
| `layout.tsx` uses `lang="fr"`                       | ✅ Fixed              |

---

## 10. Agent Guidelines & MCP

1. **Skills & MCP First:** It is **CRITICAL** to utilize installed **Skills** and **MCP servers** (like `supabase-mcp-server`) to gather context and follow established patterns **BEFORE** writing any code.
2. **Stitch UI Standard:** For all frontend development (components, pages, forms), you **MUST** first query **Stitch MCP** and use the **ProjectManagementApp** design system. Any UI work that doesn't align with the Stitch design specification is considered non-compliant.
3. **App Language:** All frontend text, labels, messages, and placeholders **MUST** be in **French**. Do not generate English UI elements.
4. **Read Before Writing:** Always read relevant skill files (e.g., `SKILL.md`) if they apply to the current task.
5. **Verify State:** Use MCP tools to check the current state of the database or environment before proposing changes.

## 11. When in Doubt

1. Check `AGENTS.md` first
2. Check `docs/PRD.md` second
3. Query Context7 MCP or Supabase MCP third
4. Only ask the user if none of the above resolves the ambiguity

---

_End of AGENTS.md v4.2.0_
