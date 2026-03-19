import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  role: z.enum(["OWNER", "ADMIN", "USER"]),
  companyId: z.string().nullable(),
  unitId: z.string().nullable(),
})

const fiscalIdRegex = z.string().regex(/^\d{5}-\d{4}$/, {
  message: "Format invalide (ex: 12345-6789)",
})

export const companySchema = z.object({
  name: z.string().min(2, "Le nom de l'entreprise est requis"),
  logo: z.string().url().optional().nullable(),
  formJur: z.enum([
    "SARL", "EURL", "SPA", "SPA-S", "SN", "SNC", "GIE", "EI", "Auto-entrepreneur"
  ]).optional().nullable(),
  sector: z.enum([
    "Construction", "Engineering", "Public Works", "Architecture",
    "Consulting", "IT", "Manufacturing", "Energy", "Transport", "Other"
  ]).optional().nullable(),
  nif: fiscalIdRegex.optional().nullable(),
  rc: fiscalIdRegex.optional().nullable(),
  nis: fiscalIdRegex.optional().nullable(),
  ai: fiscalIdRegex.optional().nullable(),
  wilaya: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
})

export const unitSchema = z.object({
  name: z.string().min(2, "Le nom de l'unité est requis"),
  address: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  logo: z.string().url().optional().nullable(),
})

export const invitationSchema = z.object({
  email: z.string().email("Email invalide"),
  role: z.enum(["ADMIN", "USER"]),
  unitId: z.string(),
})

export const clientSchema = z.object({
  name: z.string().min(2, "Le nom du client est requis"),
  wilaya: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
})

export const projectSchema = z.object({
  name: z.string().min(2, "Le nom du projet est requis"),
  code: z.string().min(2, "Le code du projet est requis"),
  clientId: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  montantHT: z.number().positive("Le montant HT doit être positif"),
  montantTTC: z.number().positive("Le montant TTC doit être positif"),
  ods: z.date().optional().nullable(),
  delaiMonths: z.number().int().min(0).default(0),
  delaiDays: z.number().int().min(0).default(0),
  status: z.enum(["New", "InProgress", "Pause", "Complete"]).default("New"),
  signe: z.boolean().default(false),
})

export const phaseSchema = z.object({
  name: z.string().min(2, "Le nom de la phase est requis"),
  code: z.string().min(1, "Le code est requis"),
  montantHT: z.number().positive(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETE"]).default("TODO"),
  observations: z.string().optional().nullable(),
})

export const subPhaseSchema = z.object({
  name: z.string().min(2, "Le nom de la sous-phase est requis"),
  code: z.string().min(1, "Le code est requis"),
  startDate: z.date(),
  endDate: z.date(),
  status: z.enum(["TODO", "COMPLETED"]).default("TODO"),
})

export const productionSchema = z.object({
  taux: z.number().min(0).max(100),
  date: z.date(),
})

export const taskSchema = z.object({
  title: z.string().min(2, "Le titre est requis"),
  description: z.string().optional().nullable(),
  projectId: z.string().min(1, "Le projet est requis"),
  phaseId: z.string().optional().nullable(),
  subPhaseId: z.string().optional().nullable(),
  laneId: z.string().optional().nullable(),
  assignedUserId: z.string().optional().nullable(),
  startDate: z.date().optional().nullable(),
  dueDate: z.date().optional().nullable(),
})

export const timeEntrySchema = z.object({
  description: z.string().optional().nullable(),
  startTime: z.date(),
  endTime: z.date().optional().nullable(),
  taskId: z.string().optional().nullable(),
  projectId: z.string().min(1, "Le projet est requis"),
})

export const commentSchema = z.object({
  body: z.string().min(1, "Le commentaire ne peut pas être vide").max(2000),
  taskId: z.string().min(1),
})

export const laneSchema = z.object({
  name: z.string().min(2, "Le nom de la colonne est requis"),
  color: z.string().optional().nullable(),
  order: z.number().int().default(0),
})

export const tagSchema = z.object({
  name: z.string().min(2, "Le nom du tag est requis"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hexadécimale requise"),
})