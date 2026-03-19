// Sidebar Store (Jotai)
// Manages sidebar collapsed/expanded state

import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

const STORAGE_KEY = "pma-sidebar-collapsed"

// Sidebar collapsed state (persisted)
export const sidebarCollapsedAtom = atomWithStorage<boolean>(STORAGE_KEY, false)

// Mobile sidebar open state (not persisted - controlled by hamburger)
export const sidebarMobileOpenAtom = atom(false)

// Helper atoms
export const sidebarWidthAtom = atom((get) => {
  const collapsed = get(sidebarCollapsedAtom)
  return collapsed ? "4rem" : "16rem"
})
