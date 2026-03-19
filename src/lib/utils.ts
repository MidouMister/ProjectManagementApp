import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"

// ─────────────────────────────────────────────────────────────────────────────
// Class Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─────────────────────────────────────────────────────────────────────────────
// Currency Formatting (Algerian Dinar)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format amount as Algerian Dinar: 1 234 567,89 DA
 */
export function formatAmount(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  
  if (isNaN(num)) return "0,00 DA"
  
  const [integer, decimal] = num.toFixed(2).split(".")
  const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  
  return `${formatted},${decimal} DA`
}

/**
 * Format amount without currency suffix
 */
export function formatNumber(num: number | string): string {
  const n = typeof num === "string" ? parseFloat(num) : num
  
  if (isNaN(n)) return "0"
  
  const [integer, decimal] = n.toFixed(2).split(".")
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "," + decimal
}

// ─────────────────────────────────────────────────────────────────────────────
// Date Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format date as: 19 Mar 2026
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  
  const d = typeof date === "string" ? new Date(date) : date
  
  if (isNaN(d.getTime())) return "—"
  
  return format(d, "dd MMM yyyy", { locale: fr })
}

/**
 * Format date as: 19 Mars 2026 (full French)
 */
export function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return "—"
  
  const d = typeof date === "string" ? new Date(date) : date
  
  if (isNaN(d.getTime())) return "—"
  
  return format(d, "dd MMMM yyyy", { locale: fr })
}

/**
 * Format date as: 19/03/2026
 */
export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "—"
  
  const d = typeof date === "string" ? new Date(date) : date
  
  if (isNaN(d.getTime())) return "—"
  
  return format(d, "dd/MM/yyyy")
}

/**
 * Format relative time: "il y a 2 heures", "dans 3 jours"
 */
export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "—"
  
  const d = typeof date === "string" ? new Date(date) : date
  
  if (isNaN(d.getTime())) return "—"
  
  return formatDistanceToNow(d, { addSuffix: true, locale: fr })
}

// ─────────────────────────────────────────────────────────────────────────────
// Délai (Contract Deadline)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format délai as: 3 mois 15 jours
 */
export function formatDelai(months: number, days: number): string {
  const parts: string[] = []
  
  if (months > 0) {
    parts.push(`${months} mois${months > 1 ? "s" : ""}`)
  }
  
  if (days > 0) {
    parts.push(`${days} jour${days > 1 ? "s" : ""}`)
  }
  
  return parts.length > 0 ? parts.join(" ") : "0 jour"
}

/**
 * Calculate remaining days from deadline
 */
export function daysRemaining(endDate: Date | string): number {
  const end = typeof endDate === "string" ? new Date(endDate) : endDate
  return differenceInDays(end, new Date())
}

// ─────────────────────────────────────────────────────────────────────────────
// Percentage Formatting
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format percentage: 75%
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

/**
 * Format decimal as percentage: 0.75 → 75%
 */
export function formatDecimalPercent(value: number): string {
  return formatPercent(value * 100)
}

// ─────────────────────────────────────────────────────────────────────────────
// TVA Calculation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculate TVA amount from HT and TTC
 */
export function calculateTVA(montantHT: number, montantTTC: number): number {
  return montantTTC - montantHT
}

/**
 * Calculate TVA percentage: ((TTC - HT) / HT) × 100
 */
export function calculateTVAPercent(montantHT: number, montantTTC: number): number {
  if (montantHT === 0) return 0
  return ((montantTTC - montantHT) / montantHT) * 100
}
