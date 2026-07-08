// ──────────────────────────────────────────────
// ZenTimer — Settings Store
// Persists user preferences to localStorage.
// ──────────────────────────────────────────────

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Settings } from '@/types'
import { audioEngine } from '@/utils/audio'

const DEFAULT_SETTINGS: Settings = {
  selectionMode: 'random',
  fixedDuration: 25,
  randomMin: 20,
  randomMax: 45,
  breakDuration: 10,
  bufferEnabled: true,
  bufferMinMinute: 3,
  bufferMaxMinute: 15,
  bufferSeconds: 15,
  volume: 50,
  autoStartBreak: true,
  autoStartFocus: false,
  locale: 'zh',
}

interface SettingsStore {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      update: (patch) =>
        set((state) => {
          const newSettings = { ...state.settings, ...patch }
          // Sync volume to audio engine
          if (patch.volume !== undefined) {
            audioEngine.setVolume(patch.volume)
          }
          return { settings: newSettings }
        }),
      reset: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'zentimer-settings',
      // Sync audio volume on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          audioEngine.setVolume(state.settings.volume)
        }
      },
    },
  ),
)
