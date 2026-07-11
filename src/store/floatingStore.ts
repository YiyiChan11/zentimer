// ──────────────────────────────────────────────
// floatingStore — Global floating window state
// Shared by: FloatingWindowButton (bottom-right),
// SettingsPanel button, and useFloatingWindow hook.
// ──────────────────────────────────────────────

import { create } from 'zustand'

interface FloatingStore {
  isOpen: boolean
  isLocked: boolean
  setOpen: (v: boolean) => void
  setLocked: (v: boolean) => void
}

export const useFloatingStore = create<FloatingStore>((set) => ({
  isOpen: false,
  isLocked: false,
  setOpen: (v: boolean) => set({ isOpen: v }),
  setLocked: (v: boolean) => set({ isLocked: v }),
}))
