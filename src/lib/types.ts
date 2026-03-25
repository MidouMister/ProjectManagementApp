// PMA TypeScript Types
// Based on PRD v2.0.0 and Prisma Schema

import { Prisma } from "@/generated/prisma/client"

// ─────────────────────────────────────────────────────────────────────────────
// Enums (must match Prisma schema exactly)
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
} as const
export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType]

// ─────────────────────────────────────────────────────────────────────────────
// Decimal Helper Types (Prisma Decimal → number)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert Prisma Decimal to number for TypeScript
 */
export type DecimalToNumber<T> = T extends Prisma.Decimal
  ? number
  : T extends Prisma.Decimal | null
  ? number | null
  : T

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
  "Ingénierie",
  "Travaux Publics",
  "Architecture",
  "Conseil",
  "Informatique",
  "Industrie",
  "Énergie",
  "Transport",
  "Autre",
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

export type OnboardingInput = {
  company: CompanyInput
  unit: UnitInput
  invitations: Array<{ email: string; role: Role }>
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Types
// ─────────────────────────────────────────────────────────────────────────────

export type ProjectInput = {
  unitId: string
  clientId: string
  name: string
  code: string
  type: string
  montantHT: string | number // String for Decimal input
  montantTTC: string | number
  ods: Date
  delaiMonths?: number
  delaiDays?: number
  status?: ProjectStatus
  signe?: boolean
}

export type PhaseInput = {
  projectId: string
  name: string
  code: string
  montantHT: string | number // String for Decimal input
  startDate: Date
  endDate: Date
  status?: PhaseStatus
  observations?: string | null
}

export type SubPhaseInput = {
  phaseId: string
  name: string
  code: string
  startDate: Date
  endDate: Date
  status?: SubPhaseStatus
}

// ─────────────────────────────────────────────────────────────────────────────
// Production Types
// ─────────────────────────────────────────────────────────────────────────────

export type ProductInput = {
  phaseId: string
  taux: number
  montantProd: string | number // String for Decimal input
  date: Date
}

export type ProductionInput = {
  productId: string
  phaseId: string
  taux: number
  date: Date
}

// ─────────────────────────────────────────────────────────────────────────────
// Task Types
// ─────────────────────────────────────────────────────────────────────────────

export type LaneInput = {
  unitId: string
  companyId: string
  name: string
  color?: string | null
  order: number
}

export type TaskInput = {
  unitId: string
  companyId: string
  projectId: string
  phaseId: string // Required per PRD
  subPhaseId?: string | null
  laneId?: string | null
  assignedUserId?: string | null
  title: string
  description?: string | null
  startDate?: Date | null
  dueDate?: Date | null
  order: number
}

export type TagInput = {
  unitId: string
  name: string
  color?: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Comment & Mention Types
// ─────────────────────────────────────────────────────────────────────────────

export type CommentInput = {
  taskId: string
  companyId: string
  authorId: string
  body: string
}

// ─────────────────────────────────────────────────────────────────────────────
// Time Entry Types
// ─────────────────────────────────────────────────────────────────────────────

export type TimeEntryInput = {
  companyId: string
  userId: string
  projectId: string
  taskId?: string | null
  description?: string | null
  startTime: Date
  endTime?: Date | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Notification Types
// ─────────────────────────────────────────────────────────────────────────────

export type NotificationInput = {
  companyId: string
  unitId?: string | null
  userId?: string | null
  type: NotificationType
  message: string
  targetRole?: Role | null
  targetUserId?: string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Activity Log Types
// ─────────────────────────────────────────────────────────────────────────────

export type ActivityLogInput = {
  companyId: string
  unitId?: string | null
  userId: string
  action: string
  entityType: string
  entityId: string
  metadata?: Record<string, unknown> | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Cache Types (for M22)
// ─────────────────────────────────────────────────────────────────────────────

export type CacheProfile = "seconds" | "minutes" | "hours" | "days" | "weeks" | "static"

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
