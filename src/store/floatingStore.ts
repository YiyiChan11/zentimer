// ──────────────────────────────────────────────
// floatingStore — Global floating window state
// Shared by: FloatingWindowButton (bottom-right),
// SettingsPanel button, and useFloatingWindow hook.
// ──────────────────────────────────────────────

import { create } from 'zustand'

interface FloatingStore {
  isOpen: boolean
  setOpen: (v: boolean) => void
}

export const useFloatingStore = create<FloatingStore>((set) => ({
  isOpen: false,
  setOpen: (v: boolean) => set({ isOpen: v }),
}))
