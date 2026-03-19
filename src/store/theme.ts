// Theme Store (Jotai)
// Manages dark/light mode preference

import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type Theme = "dark" | "light" | "system"

const STORAGE_KEY = "pma-theme"

// Persisted theme atom (localStorage)
export const themeAtom = atomWithStorage<Theme>(STORAGE_KEY, "system")

// Resolved theme (actual theme after considering system preference)
// This is updated by ThemeProvider
export const resolvedThemeAtom = atom<"dark" | "light">("light")

// Helper atoms
export const isDarkAtom = atom((get) => {
  const resolved = get(resolvedThemeAtom)
  return resolved === "dark"
})

export const isLightAtom = atom((get) => {
  const resolved = get(resolvedThemeAtom)
  return resolved === "light"
})
