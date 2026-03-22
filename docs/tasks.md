# PMA — Task Tracker

**Last Updated:** 2026-03-19
**PRD Reference:** [`docs/PRD.md`](docs/PRD.md) v2.0.0
**Conventions:** [`AGENTS.md`](AGENTS.md)
**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, shadcn/ui v4, Prisma 7, Clerk, Supabase

> Legend: `[ ]` Todo · `[/]` In Progress · `[x]` Done

---

## M00 — Project Setup & Dependencies ✅

### Foundation (COMPLETED ✅)

- [x] Initialize Next.js 16.1.7 with Turbopack 2026-03-19
- [x] Initialize React 19.2.4 2026-03-19
- [x] Configure Tailwind CSS 4.2.1 2026-03-19
- [x] Initialize shadcn/ui v4.0.8 with button component 2026-03-19
- [x] Add theme-provider component 2026-03-19
- [x] Create `src/lib/utils.ts` with `cn()` utility 2026-03-19
- [x] Create `src/app/globals.css` with design tokens (oklch color system) 2026-03-19

### Install Core Dependencies ✅

- [x] Install **Clerk**: `@clerk/nextjs` 2026-03-19
- [x] Install **Prisma 7**: `prisma`, `@prisma/adapter-pg`, `pg` 2026-03-19
- [x] Install **Supabase**: `@supabase/supabase-js`, `@supabase/ssr` 2026-03-19
- [x] Install **Jotai**: `jotai` 2026-03-19
- [x] Install **Forms**: `react-hook-form`, `@hookform/resolvers`, `zod` 2026-03-19
- [x] Install **Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` 2026-03-19
- [x] Install **Date handling**: `date-fns`, `react-day-picker` 2026-03-19
- [x] Install **File uploads**: `uploadthing`, `@uploadthing/react` 2026-03-19
- [x] Install **Utilities**: `sonner`, `lucide-react`, `next-themes` 2026-03-19
- [x] Install **Dev deps**: `dotenv`, `tsx` 2026-03-19

### Create `prisma.config.ts` ✅

- [x] Create `src/prisma.config.ts` with Prisma 7 configuration 2026-03-19
- [x] Create `src/prisma/schema.prisma` placeholder 2026-03-19
- [x] Create `src/generated/prisma/` directory 2026-03-19

### Create SSOT Files ✅

- [x] Create `src/lib/types.ts` — all TypeScript interfaces and enums 2026-03-19
- [x] Create `src/lib/cache.ts` — cache tags and `cacheLife()` profiles 2026-03-19
- [x] Create `src/lib/validators.ts` — Zod schemas for all entities 2026-03-19
- [x] Update `src/lib/utils.ts` — add `formatAmount()`, `formatDate()`, `formatDelai()`, etc. 2026-03-19
- [x] Create `src/lib/db.ts` — Prisma singleton with `@prisma/adapter-pg` 2026-03-19
- [x] Create `src/lib/supabase.ts` — Supabase browser client 2026-03-19
- [x] Create `src/lib/supabase-server.ts` — Supabase server client 2026-03-19

> **Note:** `src/lib/queries.ts` (Server Actions) will be created incrementally as features are implemented.

### Create Store & Hooks ✅

- [x] Create `src/store/theme.ts` — Jotai atoms for dark/light mode 2026-03-19
- [x] Create `src/store/sidebar.ts` — sidebar collapsed/expanded state 2026-03-19
- [x] Create `src/store/index.ts` — barrel export 2026-03-19
- [x] Create `src/hooks/useTimer.ts` — live timer hook 2026-03-19
- [x] Create `src/hooks/useNotifications.ts` — polling hook (30s) 2026-03-19
- [x] Create `src/hooks/index.ts` — barrel export 2026-03-19

### Configure Root Layout ✅

- [x] Update `src/app/layout.tsx` — `lang="fr"`, DM Sans font 2026-03-19
- [x] Add `JotaiProvider` wrapper 2026-03-19
- [x] Add `ThemeProvider` wrapper (next-themes) 2026-03-19
- [x] Add `Toaster` (sonner) 2026-03-19

> **Note:** `ClerkProvider` will be added once Clerk API keys are configured (M02).

### Install Additional shadcn/ui Components ✅

- [x] Install 21 components: dialog, sheet, card, table, tabs, badge, select, progress, tooltip, dropdown-menu, alert-dialog, skeleton, command, avatar, textarea, sonner, separator, scroll-area, popover, input, input-group 2026-03-19

---

## M01 — Prisma Schema & Database ✅

> **Important:** Schema goes in `src/prisma/schema.prisma` with Prisma 7 output path

### Create Schema

- [x] Create `src/prisma/schema.prisma` with Prisma 7 generator:
  ```prisma
  generator client {
    provider = "prisma-client"
    output   = "../generated/prisma"
  }
  ```
- [x] Define all enums from PRD §10: `Role`, `ProjectStatus`, `PhaseStatus`, `SubPhaseStatus`, `InvitationStatus`, `NotificationType`
- [x] Define models: `Plan`, `Subscription`, `Company`, `User`, `Unit`, `Invitation`
- [x] Define models: `Client`, `Project`, `Team`, `TeamMember`, `Phase`, `SubPhase`, `GanttMarker`
- [x] Define models: `Product`, `Production`, `Lane`, `Task`, `Tag`, `TaskTag`
- [x] Define models: `TaskComment`, `TaskMention`, `TimeEntry`, `Notification`, `ActivityLog`
- [x] Add `@@index` annotations for all foreign keys (performance optimization)

### Database Setup

- [x] Create `src/generated/prisma/` directory
- [x] Generate Prisma client: `pnpm exec prisma generate`
- [x] Create initial migration: `pnpm exec prisma migrate dev --name init`

### Seed Data

- [x] Create `src/prisma/seed.ts` with Plan seed:
  - **Starter**: `maxUnits=1`, `maxProjects=5`, `maxTasksPerProject=20`, `maxMembers=10`, `priceDA=0`
  - **Pro**: `maxUnits=5`, `maxProjects=30`, `maxTasksPerProject=200`, `maxMembers=50`
  - **Premium**: `maxUnits=null` (unlimited), `maxProjects=null`, `maxTasksPerProject=null`, `maxMembers=null`
- [x] Run seed: `pnpm exec prisma db seed`

---

## M02 — Authentication (Clerk) ✅

### Middleware & Protection

- [x] Create `src/proxy.ts` — protect all routes except `/`, `/company/sign-in`, `/company/sign-up`
- [x] Implement role-based redirect (OWNER → company, ADMIN → unit, USER → dashboard)
- [x] Create `/onboarding` redirect if user has no company

### Auth Pages

- [x] Create `src/app/(auth)/company/sign-in/[[...sign-in]]/page.tsx`
- [x] Create `src/app/(auth)/company/sign-up/[[...sign-up]]/page.tsx`
- [x] Style auth pages with premium "Refined Professional" aesthetic

### Webhooks

- [x] Create `/api/webhooks/clerk/route.ts`
  - [x] Handle `user.created` → sync to `User` table + sync role to Clerk metadata
  - [x] Handle `user.updated` → update name/email
  - [x] Handle `user.deleted` → delete from DB

### Invitation Flow

- [x] Create `InvitationProcessor` component (shown after sign-up if ticket exists)
- [x] Parse Clerk ticket/token → extract invitation token from URL
- [x] Create `Invitation.accept()` logic with role/unit assignment and Clerk metadata sync

---

## M03 — Root Layout & Global Components

### Dashboard Layout

- [x] Create `src/app/(dashboard)/layout.tsx`
- [x] Build `Sidebar` component:
  - [x] Collapsed/expanded (Jotai atom + localStorage)
  - [x] Role-based menu items
  - [x] Active route indicator (left-border)
  - [x] User footer (avatar, name, role)
  - [x] Days-remaining countdown chip
  - [x] Mobile: hamburger → Sheet
  - [x] Glassmorphism styling
- [x] Build `Navbar` component:
  - [x] Breadcrumbs
  - [x] Global search
  - [x] `NotificationBell` with badge
  - [x] `ThemeToggle`

### InfoBar

- [x] Build `InfoBar` component (contextual info strip)

### Dashboard Redirect

- [x] Create `src/app/(dashboard)/dashboard/page.tsx` — role-based redirect hub

---

## M04 — Onboarding Wizard ✅

> [!IMPORTANT]
> Because the middleware (`src/proxy.ts`) now relies on `publicMetadata` for redirects, the `role` and `companyId` MUST be correctly set in Clerk during the `createCompany()` Server Action to trigger automated dashboard routing.

### Routes & Components

- [x] Create `/onboarding/page.tsx` 2026-03-21
- [x] Build `CompanyOnboardingForm` multi-step component 2026-03-21

### Step 1: Company Profile

- [x] Company name, logo (Uploadthing) 2026-03-21
- [x] LegalForm dropdown (SARL, EURL, SPA, etc.) 2026-03-21
- [x] Sector dropdown (Construction, Engineering, etc.) 2026-03-21
- [x] Fiscal Identity: NIF, RC, NIS, AI (all required, unique-validated on blur) 2026-03-21
- [x] Address, wilaya, phone, email 2026-03-21

### Step 2: First Unit

- [x] Unit name, address, phone, email 2026-03-21
- [x] Admin assignment (current user auto-assigned) 2026-03-21

### Step 3: Invite Team (optional)

- [x] Email input + role picker (ADMIN, USER) 2026-03-21
- [x] Skip button 2026-03-21

### Server Actions

- [x] Implement `createCompany()` — creates Company + assigns OWNER 2026-03-21
- [x] Implement `createUnit()` — creates Unit with admin 2026-03-21
- [x] Implement `createSubscription()` — auto Starter trial (2 months) 2026-03-21
- [x] Implement `inviteMember()` — creates Invitation record 2026-03-21

### Validation

- [x] `companySchema` Zod validator (RC regex: `^\\d{5}-\\d{4}$`) 2026-03-21
- [x] `unitSchema` Zod validator 2026-03-21
- [x] `invitationSchema` Zod validator 2026-03-21
- [x] Per-field unique validation for NIF/RC/NIS/AI 2026-03-21

---

## M05 — Company Management (OWNER)

### Routes

- [ ] Create `/company/[companyId]/page.tsx` — Company dashboard
  - [ ] KPI cards: total projects, active projects, total TTC, members, production status
  - [ ] Unit overview cards
- [ ] Create `/company/[companyId]/settings/page.tsx` — Company profile + legal IDs
- [ ] Create `/company/[companyId]/units/page.tsx` — Units CRUD
- [ ] Create `/company/[companyId]/team/page.tsx` — Company-wide team

### Server Actions

- [ ] `getCompanyHeader()` — with `cacheLife("static")`
- [ ] `getCompanyById()` — with `cacheLife("days")`
- [ ] `updateCompany()` — with `revalidateTag()`
- [ ] `deleteCompany()` — cascade delete
- [ ] `createUnit()` / `updateUnit()` / `deleteUnit()` — with plan limit check

### Components

- [ ] `CompanyForm` — edit company fields
- [ ] `UnitCard` — unit overview with member/project counts
- [ ] `UnitModal` — create/edit/delete unit

---

## M06 — Subscription & Billing (OWNER)

### Billing Page

- [ ] Create `/company/[companyId]/settings/billing/page.tsx`
- [ ] Plan name, limits table, expiry date, days remaining
- [ ] Usage vs. limits progress bars
- [ ] Proforma invoice download (if exists)

### Upgrade Flow

- [ ] Build `UpgradeRequestForm` Dialog
- [ ] Fields: desired plan, contact email, phone, payment method, message
- [ ] Implement `requestUpgrade()` — creates `GENERAL` notification

### Subscription Enforcement

- [ ] Implement `checkPlanLimit()` utility in `queries.ts`
- [ ] `UpgradePromptModal` — shown when limit reached
- [ ] Trial expiry notifications (T-30, T-7, T-3) — computed from `endAt`
- [ ] Grace period detection (7 days after expiry)
- [ ] Read-only mode enforcement — check status before all mutations
- [ ] Persistent upgrade banner component
- [ ] Days-remaining countdown chip (sidebar + billing)

---

## M07 — Team & Invitations

### Server Actions

- [ ] `inviteMember()` — Clerk invitation + DB record, block OWNER role
- [ ] `cancelInvitation()` — revoke pending invitation
- [ ] `resendInvitation()` — regenerate token, extend expiresAt
- [ ] `acceptInvitation()` — assign role + unit to user
- [ ] `removeMember()` — revoke access, retain data
- [ ] Plan `userLimit` check before insert

### Member Directory

- [ ] Create `/unite/[unitId]/members/page.tsx`
- [ ] Member table: avatar, name, email, role badge, job title, joined, status
- [ ] Invite member Sheet
- [ ] Pending invitations list
- [ ] Cancel/resend/remove actions with confirmation

---

## M08 — Client CRM

### Server Actions

- [ ] `createClient()` — name unique within unit, email unique within unit
- [ ] `updateClient()`
- [ ] `deleteClient()` — block if active InProgress projects

### Validation

- [ ] `clientSchema` Zod validator

### Client Pages

- [ ] Create `/unite/[unitId]/clients/page.tsx`
- [ ] Client list: name, wilaya, phone, email, project count, total TTC
- [ ] Search by name, sort by name / total contract value
- [ ] Create/edit client Sheet
- [ ] Client detail Sheet: contact, linked projects, total TTC

---

## M09 — Project Management

### Server Actions

- [ ] `createProject()` — auto-create Team, check maxProjects limit, `PROJECT` notification
- [ ] `updateProject()`
- [ ] `deleteProject()`
- [ ] `archiveProject()`
- [ ] Financial logic: TVA calculation, weighted progress

### Project List

- [ ] Create `/unite/[unitId]/projects/page.tsx`
- [ ] List: name, code, client, status badge, montantTTC, progress bar
- [ ] Filters: status, client; Sort: date, montantTTC
- [ ] Create project modal (`ProjectFormModal`)

### Project Detail

- [ ] Create `/unite/[unitId]/projects/[projectId]/page.tsx`
- [ ] Tabs: Overview · Gantt · Production · Tasks · Time Tracking · Documents
- [ ] Overview: financials (HT, TTC, TVA), progress, team, client, ODS, délai
- [ ] Team management: `addTeamMember()`, `removeTeamMember()`, `TEAM` notification

---

## M10 — Phase & Gantt Planning

### Server Actions

- [ ] `createPhase()` — validate startDate ≥ Project.ods, check budget sum
- [ ] `updatePhase()` — validate budget constraint
- [ ] `deletePhase()`
- [ ] `createSubPhase()` — validate dates within parent range
- [ ] `updateSubPhase()` / `deleteSubPhase()`
- [ ] `createGanttMarker()` / `deleteGanttMarker()`
- [ ] `reschedulePhase()` — drag-to-reschedule

### Validation

- [ ] `phaseSchema` Zod validator
- [ ] `subPhaseSchema` Zod validator

### Gantt Component

- [ ] Phase horizontal bars, color-coded by status
- [ ] SubPhase nested indented bars
- [ ] GanttMarkers as vertical dashed lines with diamond icon
- [ ] Progress fill overlay on each bar
- [ ] Timeline header: Month / Week / Day zoom
- [ ] Phase detail Sheet (480px)
- [ ] Phase overlap warning (visual)
- [ ] Phase budget sum warning (exceeds project.montantHT)
- [ ] Auto-calculate: `duration = (endDate - startDate)` days
- [ ] Auto-calculate: `progress = avg(SubPhase.progress)` when SubPhases exist

### Realtime

- [ ] Supabase channel: `project:{projectId}:phases`

---

## M11 — Production Monitoring

### Server Actions

- [ ] `createProduct()` — one per phase, planned baseline
- [ ] `updateProduct()`
- [ ] `createProduction()` — `mntProd` calculated server-side
- [ ] `updateProduction()` / `deleteProduction()`

### Validation

- [ ] `productionSchema` Zod validator

### Production Tab

- [ ] Line chart: Planned vs. Actual rate
- [ ] Grouped bar chart: Planned vs. Actual amount
- [ ] Data table: date, planned taux, actual taux, variance, variance % (red rows when actual < planned)

### Unit-wide View

- [ ] Create `/unite/[unitId]/productions/page.tsx`

### Alerts

- [ ] Production variance alert (actual < threshold%) → `PRODUCTION` notification
- [ ] Phase complete + milestone → `PRODUCTION` notification

---

## M12 — Task & Kanban Board

### Server Actions

- [ ] `createLane()` / `updateLane()` / `deleteLane()` — confirm if tasks assigned
- [ ] `reorderLanes()`
- [ ] `createTask()` — check maxTasksPerProject, `TASK` notification
- [ ] `updateTask()` / `deleteTask()`
- [ ] `moveTask()` — lane change
- [ ] `reorderTasks()`

### Validation

- [ ] `taskSchema` Zod validator
- [ ] Tag management: `createTag()`, `updateTag()`, `deleteTag()`

### Kanban Page

- [ ] Create `/unite/[unitId]/kanban/page.tsx`
- [ ] Lane columns with task cards
- [ ] Drag-and-drop between lanes (@dnd-kit)
- [ ] RBAC: ADMIN/OWNER drag any; USER only assigned tasks
- [ ] Project filter (required), Phase filter (optional)
- [ ] Overdue badge (red) when dueDate < NOW && !complete

### Task Detail Sheet

- [ ] 480px slide-over panel
- [ ] Title, description, status, lane, project, phase context
- [ ] Assignee picker (TeamMembers only)
- [ ] Due date picker
- [ ] Tags (multi-select)
- [ ] Time entries list
- [ ] Comments thread

### Realtime

- [ ] Supabase channel: `unit:{unitId}:tasks`

---

## M13 — Task Comments & @Mentions

### Server Actions

- [ ] `createComment()` — parse @mentions, create `TaskMention` records, notifications
- [ ] `editComment()` — own comments only, "(edited)" indicator
- [ ] `deleteComment()` — own or ADMIN/OWNER, set to `"[Message supprimé]"`

### Validation

- [ ] `commentSchema` Zod validator

### Comment Components

- [ ] `CommentInput` — avatar, textarea, @mention autocomplete (Command)
- [ ] `CommentsThread` — chronological, author info, edit/delete menu
- [ ] Deleted comments: `"[Message supprimé]"`
- [ ] Mention highlighting (indigo chips)

### @Mention Logic

- [ ] Trigger `@` → autocomplete dropdown (TeamMembers only)
- [ ] Parse on save → create `TaskMention` records
- [ ] Send `TASK` notification to mentioned users
- [ ] Cannot @mention yourself

### Realtime

- [ ] Supabase channel: `task:{taskId}:comments`
- [ ] `unstable_noStore()` — never cache comments

---

## M14 — Time Tracking

### Server Actions

- [ ] `createTimeEntry()` — USERs: assigned projects only
- [ ] `updateTimeEntry()` / `deleteTimeEntry()` — own or ADMIN/OWNER

### Validation

- [ ] `timeEntrySchema` Zod validator

### Time Tracking Tab

- [ ] Project tab: entries grouped by user, total per week, grand total
- [ ] Manual entry form: startTime, endTime, description
- [ ] `useTimer` hook — live timer on task, auto-fill on stop

### Task Detail Sheet

- [ ] Time entries section: avatar, duration, description

---

## M15 — Notifications System

### Core

- [ ] `createNotification()` — internal utility called by all server actions
- [ ] `markNotificationRead()` / `markAllNotificationsRead()`
- [ ] `getNotifications()` — `unstable_noStore()`
- [ ] `getUnreadCount()` — `unstable_noStore()`

### UI

- [ ] `NotificationBell` — badge, dropdown (latest 5), bell-only polling (30s)
- [ ] `/dashboard/notifications/page.tsx` — full list, filter tabs, "mark all read"

### Triggers (per type)

| Type         | Recipients                   | Trigger                    |
| ------------ | ---------------------------- | -------------------------- |
| `INVITATION` | invitee                      | accept/reject              |
| `PROJECT`    | OWNER, ADMIN, assigned USERs | status change              |
| `TASK`       | assigned user                | assigned                   |
| `TEAM`       | affected user                | add/remove from project    |
| `PHASE`      | OWNER, ADMIN                 | status change              |
| `CLIENT`     | OWNER, ADMIN                 | add/update                 |
| `PRODUCTION` | OWNER                        | variance alert / milestone |
| `LANE`       | OWNER, ADMIN                 | create/delete              |
| `TAG`        | OWNER, ADMIN                 | create/delete              |
| `GENERAL`    | all                          | system announcements       |

### Realtime

- [ ] Supabase channel: `unit:{unitId}:notifications` (bell badge update)

---

## M16 — Document Management

### Server Actions

- [ ] `createDocument()` — Uploadthing upload
- [ ] `deleteDocument()` — DB + Uploadthing deletion

### Documents Tab

- [ ] File list: name, type, size, uploader, date
- [ ] Upload button (PDF, PNG, JPG, DWG — max 10 MB)
- [ ] Download link
- [ ] Delete with confirmation (ADMIN/OWNER only)

### RBAC

- [ ] TeamMembers: view/download
- [ ] ADMIN/OWNER: upload/delete

---

## M17 — Activity Logs

### Core

- [ ] `createActivityLog()` — utility for create/edit/delete events
- [ ] `getActivityLogs()` — `unstable_noStore()`

### UI

- [ ] Filters: date range, entityType, user
- [ ] RBAC: OWNER all, ADMIN unit-scoped, USER project-scoped

### Integration

- [ ] Add activity log calls to all relevant server actions

---

## M18 — User Workspace (USER Role)

### Routes

- [ ] `/dashboard` — personal dashboard with redirect
- [ ] `/user/[userId]/page.tsx` — assigned tasks, upcoming due dates, notifications
- [ ] `/user/[userId]/profile/page.tsx` — account settings
- [ ] `/user/[userId]/tasks/page.tsx` — all assigned tasks, project-scoped
- [ ] `/user/[userId]/projects/page.tsx` — TeamMember projects list
- [ ] `/user/[userId]/analytics/page.tsx` — tasks completed, time logged, projects

---

## M19 — Unit Dashboard (ADMIN)

### Route

- [ ] `/unite/[unitId]/page.tsx`
- [ ] KPI cards: projects, active tasks, members, production
- [ ] Recent activity
- [ ] Quick action buttons

---

## M20 — Public Landing Page

### Route

- [ ] `/page.tsx` (root) — replace boilerplate

### Content

- [ ] Hero section
- [ ] Features overview
- [ ] Plan comparison table
- [ ] CTA to sign-up
- [ ] SEO: title, meta descriptions, semantic HTML

---

## M21 — Polish & Quality

- [ ] Dark/light mode toggle (Jotai + localStorage)
- [ ] Responsive audit (≥ 768px)
- [ ] Accessibility pass (WCAG 2.1 AA, keyboard nav, ARIA)
- [ ] ErrorBoundary on all async sections
- [ ] Skeleton loaders on data-fetching components
- [ ] Empty states with illustration + message + CTA
- [ ] Performance: LCP < 2.5s, Kanban 200 tasks, comments 200
- [ ] Rate limiting on comment, time entry, notification actions
- [ ] Realtime disconnection handling (reconnect indicator + refetch)

---

## M22 — Caching & Performance

### Cache Implementation

- [ ] All `'use cache'` directives on cacheable functions
- [ ] All `cacheTag()` / `cacheLife()` usage per PRD §19

### Cache Invalidation

- [ ] All `revalidateTag()` calls per invalidation map
- [ ] `unstable_noStore()` for: notifications, comments, activity logs

### Verification

- [ ] No broad cache invalidation — all tags entity-scoped
- [ ] No `revalidatePath()` — use `revalidateTag()` only

---

## Dependency Graph

```
M00 (Foundation) ──► M01 (Prisma) ──► M02 (Clerk) ──► M03 (Layout)
                                                               │
                                                               ▼
M04 (Onboarding) ──► M05 ──► M06 ──► M07 ──► M08 ──► M09 ──► M10
                         │       │       │       │       │
                         │       │       │       │       ▼
                         │       │       │       │     M11-M12
                         │       │       │       │
                         │       │       │       ▼
                         │       │       │    M13-M14
                         │       │       │
                         │       │       ▼
                         │       │    M15-M17
                         │       │
                         │       ▼
                         │    M18-M19
                         │
                         ▼
                      M20 ──► M21 ──► M22
```

---

_End of Task Tracker_
