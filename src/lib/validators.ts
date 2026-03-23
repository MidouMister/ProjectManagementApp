import { z } from "zod"

// ─────────────────────────────────────────────────────────────────────────────
// Auth / User
// ─────────────────────────────────────────────────────────────────────────────

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  role: z.enum(["OWNER", "ADMIN", "USER"]),
  companyId: z.string().nullable(),
  unitId: z.string().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Company & Onboarding
// ─────────────────────────────────────────────────────────────────────────────

export const companySchema = z.object({
  name: z.string().min(2, "Le nom de l'entreprise est requis"),
  logo: z.string().optional().nullable(),
  formJur: z.enum([
    "SARL", "EURL", "SPA", "SPA-S", "SN", "SNC", "GIE", "EI", "Auto-entrepreneur"
  ]),
  sector: z.enum([
    "Construction", "Engineering", "Public Works", "Architecture",
    "Consulting", "IT", "Manufacturing", "Energy", "Transport", "Other"
  ]),
  NIF: z.string().min(5, "Le NIF est requis"),
  RC: z.string()
    .min(5, "Le RC est requis")
    .regex(/^\d{5}-\d{4}$/, "Le RC doit être au format XXXXX-XXXX"),
  NIS: z.string().optional().nullable(),
  AI: z.string().optional().nullable(),
  wilaya: z.string().min(1, "La wilaya est requise"),
  address: z.string().min(5, "L'adresse est requise"),
  phone: z.string().min(10, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide"),
})

export const unitSchema = z.object({
  name: z.string().min(2, "Le nom de l'unité est requis"),
  address: z.string().min(5, "L'adresse de l'unité est requise"),
  phone: z.string().min(10, "Le téléphone de l'unité est requis"),
  email: z.string().email("Email de l'unité invalide"),
})

export const invitationSchema = z.object({
  email: z.string().email("Email invalide"),
  role: z.enum(["ADMIN", "USER"]), // OWNER cannot be invited
  unitId: z.string().min(1, "L'unité est requise"),
})

export const onboardingSchema = z.object({
  company: companySchema,
  unit: unitSchema,
  invitations: z.array(invitationSchema).optional().default([]),
})

// ─────────────────────────────────────────────────────────────────────────────
// Client
// ─────────────────────────────────────────────────────────────────────────────

export const clientSchema = z.object({
  name: z.string().min(2, "Le nom du client est requis"),
  wilaya: z.string().min(1, "La wilaya est requise"),
  phone: z.string().min(1, "Le numéro de téléphone est requis"),
  email: z.string().email("Email invalide"),
})

// ─────────────────────────────────────────────────────────────────────────────
// Project (Decimal fields accept string or number)
// ─────────────────────────────────────────────────────────────────────────────

export const projectSchema = z.object({
  unitId: z.string().min(1, "L'unité est requise"),
  clientId: z.string().min(1, "Le client est requis"),
  name: z.string().min(2, "Le nom du projet est requis"),
  code: z.string().min(1, "Le code du projet est requis"),
  type: z.string().min(1, "Le type de projet est requis"),
  montantHT: z.union([z.string(), z.number()])
    .refine((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val
      return !isNaN(num) && num > 0
    }, "Le montant HT doit être un nombre positif"),
  montantTTC: z.union([z.string(), z.number()])
    .refine((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val
      return !isNaN(num) && num > 0
    }, "Le montant TTC doit être un nombre positif"),
  ods: z.date({ message: "La date ODS est requise" }),
  delaiMonths: z.number().int().min(0).default(0),
  delaiDays: z.number().int().min(0).default(0),
  status: z.enum(["New", "InProgress", "Pause", "Complete"]).default("New"),
  signe: z.boolean().default(false),
})

// ─────────────────────────────────────────────────────────────────────────────
// Phase
// ─────────────────────────────────────────────────────────────────────────────

export const phaseSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  name: z.string().min(2, "Le nom de la phase est requis"),
  code: z.string().min(1, "Le code est requis"),
  montantHT: z.union([z.string(), z.number()])
    .refine((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val
      return !isNaN(num) && num > 0
    }, "Le montant HT doit être un nombre positif"),
  startDate: z.date({ message: "La date de début est requise" }),
  endDate: z.date({ message: "La date de fin est requise" }),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETE"]).default("TODO"),
  observations: z.string().optional().nullable(),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: "La date de fin doit être après la date de début", path: ["endDate"] }
)

// ─────────────────────────────────────────────────────────────────────────────
// SubPhase
// ─────────────────────────────────────────────────────────────────────────────

export const subPhaseSchema = z.object({
  phaseId: z.string().min(1, "La phase parente est requise"),
  name: z.string().min(2, "Le nom de la sous-phase est requis"),
  code: z.string().min(1, "Le code est requis"),
  startDate: z.date({ message: "La date de début est requise" }),
  endDate: z.date({ message: "La date de fin est requise" }),
  status: z.enum(["TODO", "COMPLETED"]).default("TODO"),
}).refine(
  (data) => data.endDate > data.startDate,
  { message: "La date de fin doit être après la date de début", path: ["endDate"] }
)

// ─────────────────────────────────────────────────────────────────────────────
// Production
// ─────────────────────────────────────────────────────────────────────────────

export const productSchema = z.object({
  phaseId: z.string().min(1, "La phase est requise"),
  taux: z.number().min(0).max(100, "Le taux doit être entre 0 et 100"),
  montantProd: z.union([z.string(), z.number()])
    .refine((val) => {
      const num = typeof val === "string" ? parseFloat(val) : val
      return !isNaN(num) && num >= 0
    }, "Le montant de production doit être un nombre positif"),
  date: z.date({ message: "La date est requise" }),
})

export const productionSchema = z.object({
  productId: z.string().min(1, "Le produit est requis"),
  phaseId: z.string().min(1, "La phase est requise"),
  taux: z.number().min(0).max(100, "Le taux doit être entre 0 et 100"),
  date: z.date({ message: "La date est requise" }),
})

// ─────────────────────────────────────────────────────────────────────────────
// Kanban Lanes & Tags
// ─────────────────────────────────────────────────────────────────────────────

export const laneSchema = z.object({
  name: z.string().min(2, "Le nom de la colonne est requis"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hexadécimale requise").optional().nullable(),
  order: z.number().int().min(0).default(0),
})

export const tagSchema = z.object({
  name: z.string().min(2, "Le nom du tag est requis"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hexadécimale requise").optional().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Tasks
// ─────────────────────────────────────────────────────────────────────────────

export const taskSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  phaseId: z.string().min(1, "La phase est requise"), // Required per PRD
  subPhaseId: z.string().optional().nullable(),
  laneId: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
  title: z.string().min(2, "Le titre est requis"),
  description: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  dueDate: z.date().optional().nullable(),
  order: z.number().int().min(0).default(0),
})

// ─────────────────────────────────────────────────────────────────────────────
// Time Entries
// ─────────────────────────────────────────────────────────────────────────────

export const timeEntrySchema = z.object({
  description: z.string().optional().nullable(),
  startTime: z.date({ message: "L'heure de début est requise" }),
  endTime: z.date().optional().nullable(),
  taskId: z.string().optional().nullable(),
  projectId: z.string().min(1, "Le projet est requis"),
}).refine(
  (data) => !data.endTime || data.endTime > data.startTime,
  { message: "L'heure de fin doit être après l'heure de début", path: ["endTime"] }
)

// ─────────────────────────────────────────────────────────────────────────────
// Comments
// ─────────────────────────────────────────────────────────────────────────────

export const commentSchema = z.object({
  body: z.string()
    .min(1, "Le commentaire ne peut pas être vide")
    .max(2000, "Le commentaire ne peut pas dépasser 2000 caractères"),
  taskId: z.string().min(1),
})

// ─────────────────────────────────────────────────────────────────────────────
// Gantt Markers
// ─────────────────────────────────────────────────────────────────────────────

export const ganttMarkerSchema = z.object({
  projectId: z.string().min(1, "Le projet est requis"),
  label: z.string().min(1, "Le label est requis"),
  date: z.date({ message: "La date est requise" }),
  className: z.string().optional().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Team
// ─────────────────────────────────────────────────────────────────────────────

export const teamMemberSchema = z.object({
  userId: z.string().min(1, "L'utilisateur est requis"),
  roleLabel: z.string().optional().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Notification
// ─────────────────────────────────────────────────────────────────────────────

export const notificationSchema = z.object({
  type: z.enum([
    "INVITATION", "PROJECT", "TASK", "TEAM", "PHASE",
    "CLIENT", "PRODUCTION", "LANE", "TAG", "GENERAL"
  ]),
  message: z.string().min(1, "Le message est requis"),
  targetRole: z.enum(["OWNER", "ADMIN", "USER"]).optional().nullable(),
  targetUserId: z.string().optional().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Activity Log
// ─────────────────────────────────────────────────────────────────────────────

export const activityLogSchema = z.object({
  action: z.enum(["CREATE", "UPDATE", "DELETE"]),
  entityType: z.string().min(1, "Le type d'entité est requis"),
  entityId: z.string().min(1, "L'ID de l'entité est requis"),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Upgrade Request
// ─────────────────────────────────────────────────────────────────────────────

export const upgradeRequestSchema = z.object({
  planName: z.enum(["Pro", "Premium"]),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone est requis"),
  paymentMethod: z.enum(["CHEQUE", "VIREMENT", "ESPECES"]),
  message: z.string().optional().nullable(),
})

// ─────────────────────────────────────────────────────────────────────────────
// Type exports for form schemas
// ─────────────────────────────────────────────────────────────────────────────

export type CompanyFormData = z.infer<typeof companySchema>
export type UnitFormData = z.infer<typeof unitSchema>
export type ClientFormData = z.infer<typeof clientSchema>
export type ProjectFormData = z.infer<typeof projectSchema>
export type PhaseFormData = z.infer<typeof phaseSchema>
export type SubPhaseFormData = z.infer<typeof subPhaseSchema>
export type LaneFormData = z.infer<typeof laneSchema>
export type TagFormData = z.infer<typeof tagSchema>
export type TaskFormData = z.infer<typeof taskSchema>
export type TimeEntryFormData = z.infer<typeof timeEntrySchema>
export type CommentFormData = z.infer<typeof commentSchema>
