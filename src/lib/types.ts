// PMA TypeScript Types
// Based on PRD v2.0.0

// ─────────────────────────────────────────────────────────────────────────────
// Enums (must match Prisma schema)
// ─────────────────────────────────────────────────────────────────────────────

export const Role = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  USER: "USER",
} as const
export type Role = (typeof Role)[keyof typeof Role]

export const SubscriptionStatus = {
  TRIAL: "TRIAL",
  ACTIVE: "ACTIVE",
  GRACE: "GRACE",
  READONLY: "READONLY",
  SUSPENDED: "SUSPENDED",
} as const
export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]

export const ProjectStatus = {
  New: "New",
  InProgress: "InProgress",
  Pause: "Pause",
  Complete: "Complete",
} as const
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]

export const PhaseStatus = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETE: "COMPLETE",
} as const
export type PhaseStatus = (typeof PhaseStatus)[keyof typeof PhaseStatus]

export const SubPhaseStatus = {
  TODO: "TODO",
  COMPLETED: "COMPLETED",
} as const
export type SubPhaseStatus = (typeof SubPhaseStatus)[keyof typeof SubPhaseStatus]

export const InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const
export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus]

export const NotificationType = {
  INVITATION: "INVITATION",
  PROJECT: "PROJECT",
  TASK: "TASK",
  TEAM: "TEAM",
  PHASE: "PHASE",
  CLIENT: "CLIENT",
  PRODUCTION: "PRODUCTION",
  LANE: "LANE",
  TAG: "TAG",
  GENERAL: "GENERAL",
  COMMENT: "COMMENT",
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

// ─────────────────────────────────────────────────────────────────────────────
// Legal Forms (Algeria)
// ─────────────────────────────────────────────────────────────────────────────

export const LegalFormOptions = [
  "SARL",
  "EURL",
  "SPA",
  "SPA-S",
  "SN",
  "SNC",
  "GIE",
  "EI",
  "Auto-entrepreneur",
] as const
export type LegalForm = (typeof LegalFormOptions)[number]

export const SectorOptions = [
  "Construction",
  "Engineering",
  "Public Works",
  "Architecture",
  "Consulting",
  "IT",
  "Manufacturing",
  "Energy",
  "Transport",
  "Other",
] as const
export type Sector = (typeof SectorOptions)[number]

// ─────────────────────────────────────────────────────────────────────────────
// Result Types for Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export type Result<T, E = string> = 
  | { success: true; data: T }
  | { success: false; error: E }

export type PlanLimits = {
  maxUnits: number | null
  maxProjects: number | null
  maxTasksPerProject: number | null
  maxMembers: number | null
}

// ─────────────────────────────────────────────────────────────────────────────
// API Types
// ─────────────────────────────────────────────────────────────────────────────

export type SessionUser = {
  id: string
  clerkId: string
  name: string
  email: string
  role: Role
  companyId: string | null
  unitId: string | null
}

export type SubscriptionWithPlan = {
  id: string
  companyId: string
  planId: string
  status: SubscriptionStatus
  startAt: Date
  endAt: Date
  plan: {
    id: string
    name: string
    maxUnits: number | null
    maxProjects: number | null
    maxTasksPerProject: number | null
    maxMembers: number | null
    priceDA: number
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Cache Types (for M22)
// ─────────────────────────────────────────────────────────────────────────────

export type CacheProfile = "seconds" | "minutes" | "hours" | "days" | "weeks" | "static"

export const CacheTags = {
  companies: "companies",
  company: (id: string) => `company:${id}`,
  units: (companyId: string) => `company:${companyId}:units`,
  unit: (id: string) => `unit:${id}`,
  projects: (unitId: string) => `unit:${unitId}:projects`,
  project: (id: string) => `project:${id}`,
  phases: (projectId: string) => `project:${projectId}:phases`,
  clients: (unitId: string) => `unit:${unitId}:clients`,
  members: (unitId: string) => `unit:${unitId}:members`,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Input Types for Server Actions
// ─────────────────────────────────────────────────────────────────────────────

export type CompanyInput = {
  name: string
  logo?: string | null
  formJur: LegalForm
  sector: Sector
  NIF: string
  RC: string
  NIS?: string | null
  AI?: string | null
  wilaya: string
  address: string
  phone: string
  email: string
}

export type UnitInput = {
  name: string
  address: string
  phone: string
  email: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Wilaya (Algerian Provinces)
// ─────────────────────────────────────────────────────────────────────────────

export const WilayaOptions = [
  "Adrar", "Ain Defla", "Ain Temouchent", "Alger", "Annaba", "Batna", "Bejaia",
  "Biskra", "Blida", "Bordj Bou Arreridj", "Bouira", "Boumerdes", "Chlef",
  "Constantine", "Djelfa", "El Bayadh", "El Oued", "El Tarf", "Ghardaia",
  "Guelma", "Illizi", "Jijel", "Khenchela", "Laghouat", "Mascara", "Medea",
  "Mila", "Mostaganem", "Msila", "Naama", "Oran", "Ouargla", "Oum El Bouaghi",
  "Relizane", "Saida", "Setif", "Sidi Bel Abbes", "Skikda", "Souk Ahras",
  "Tamanrasset", "Tebessa", "Tlemcen", "Touggourt", "Tizi Ouzou",
] as const
export type Wilaya = (typeof WilayaOptions)[number]
