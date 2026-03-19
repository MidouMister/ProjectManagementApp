// PMA Cache Configuration
// Based on PRD v2.0.0 §22

// ─────────────────────────────────────────────────────────────────────────────
// Cache Life Profiles
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cache profiles for 'use cache' + cacheLife() directive
 * 
 * Usage in Server Components:
 * ```typescript
 * 'use cache'
 * cacheLife('minutes')
 * cacheTag('companies')
 * ```
 */

export const CacheProfiles = {
  /** Static content - cached until manually invalidated */
  static: { maxAge: 0, staleWhileRevalidate: 0, refetch: false },
  
  /** Revalidate every hour */
  hours: { maxAge: 60 * 60, staleWhileRevalidate: 60 * 60, refetch: true },
  
  /** Revalidate every 10 minutes */
  minutes: { maxAge: 60 * 10, staleWhileRevalidate: 60 * 5, refetch: true },
  
  /** Revalidate every 5 minutes */
  days: { maxAge: 60 * 60 * 24, staleWhileRevalidate: 60 * 60 * 12, refetch: true },
  
  /** Always fresh */
  dynamic: { maxAge: 0, staleWhileRevalidate: 0, refetch: true },
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Cache Tags (for revalidateTag())
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Entity-scoped cache tags for targeted invalidation.
 * Always use these factory functions to generate tags.
 */

export const CacheTags = {
  // Company-scoped
  companies: () => "companies",
  company: (id: string) => `company:${id}`,
  
  // Unit-scoped (also invalidates company-level caches)
  companyUnits: (companyId: string) => `company:${companyId}:units`,
  unit: (id: string) => `unit:${id}`,
  
  // Project-scoped
  unitProjects: (unitId: string) => `unit:${unitId}:projects`,
  project: (id: string) => `project:${id}`,
  projectPhases: (projectId: string) => `project:${projectId}:phases`,
  projectTeam: (projectId: string) => `project:${projectId}:team`,
  
  // Client-scoped
  unitClients: (unitId: string) => `unit:${unitId}:clients`,
  
  // Member-scoped
  unitMembers: (unitId: string) => `unit:${unitId}:members`,
  
  // Lane-scoped
  unitLanes: (unitId: string) => `unit:${unitId}:lanes`,
  
  // Tag-scoped
  unitTags: (unitId: string) => `unit:${unitId}:tags`,
  
  // Production
  phaseProduction: (phaseId: string) => `phase:${phaseId}:production`,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Cache Invalidation Map
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps mutations to the cache tags that must be revalidated.
 * Use revalidateTag() after every create/update/delete operation.
 */

export const InvalidationMap = {
  createCompany: [CacheTags.companies()],
  updateCompany: (id: string) => [
    CacheTags.companies(),
    CacheTags.company(id),
  ],
  
  createUnit: (companyId: string) => [
    CacheTags.companyUnits(companyId),
    CacheTags.company(companyId),
  ],
  updateUnit: (unitId: string, companyId: string) => [
    CacheTags.companyUnits(companyId),
    CacheTags.unit(unitId),
  ],
  deleteUnit: (unitId: string, companyId: string) => [
    CacheTags.companyUnits(companyId),
    CacheTags.unit(unitId),
  ],
  
  createProject: (unitId: string, companyId: string) => [
    CacheTags.unitProjects(unitId),
    CacheTags.company(companyId),
  ],
  updateProject: (projectId: string, unitId: string) => [
    CacheTags.project(projectId),
    CacheTags.unitProjects(unitId),
  ],
  deleteProject: (projectId: string, unitId: string) => [
    CacheTags.project(projectId),
    CacheTags.unitProjects(unitId),
  ],
  
  createPhase: (projectId: string) => [
    CacheTags.project(projectId),
    CacheTags.projectPhases(projectId),
  ],
  updatePhase: (projectId: string) => [
    CacheTags.project(projectId),
    CacheTags.projectPhases(projectId),
  ],
  
  createClient: (unitId: string) => [CacheTags.unitClients(unitId)],
  updateClient: (unitId: string) => [CacheTags.unitClients(unitId)],
  deleteClient: (unitId: string) => [CacheTags.unitClients(unitId)],
  
  createLane: (unitId: string) => [CacheTags.unitLanes(unitId)],
  deleteLane: (unitId: string) => [CacheTags.unitLanes(unitId)],
  
  createTag: (unitId: string) => [CacheTags.unitTags(unitId)],
  deleteTag: (unitId: string) => [CacheTags.unitTags(unitId)],
  
  // Always use unstable_noStore() for these - never cached:
  // - Notifications
  // - Comments
  // - Activity Logs
  // - Time Entries
} as const

// ─────────────────────────────────────────────────────────────────────────────
// Uncached Data (always use unstable_noStore())
// ─────────────────────────────────────────────────────────────────────────────

export const UNCACHED = {
  notifications: true,
  comments: true,
  activityLogs: true,
  timeEntries: true,
} as const
