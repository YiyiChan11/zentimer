// ──────────────────────────────────────────────
// updaterStore — Shared auto-update state (Tauri only)
// Both SettingsPanel (manual check) and UpdateNotification (toast)
// read from this single store so they stay in sync.
// ──────────────────────────────────────────────

import { create } from 'zustand'
import { isTauri } from '@/utils/tauri'

export interface UpdateInfo {
  version: string
  date: string
  body: string
}

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'not-available'
  | 'downloading'
  | 'installed'
  | 'error'

interface UpdaterState {
  status: UpdateStatus
  updateInfo: UpdateInfo | null
  downloadProgress: number
  errorMsg: string
  currentVersion: string
  /** Fetch the running app version (Tauri) — call once on startup */
  init: () => Promise<void>
  /** Check the GitHub release endpoint for a newer version */
  checkForUpdates: () => Promise<void>
  /** Download + install the pending update, then relaunch */
  downloadAndInstall: () => Promise<void>
  dismiss: () => void
}

export const useUpdaterStore = create<UpdaterState>((set) => ({
  status: 'idle',
  updateInfo: null,
  downloadProgress: 0,
  errorMsg: '',
  currentVersion: '',

  init: async () => {
    if (!isTauri()) {
      set({ currentVersion: 'web' })
      return
    }
    try {
      const { getVersion } = await import('@tauri-apps/api/app')
      const v = await getVersion()
      set({ currentVersion: v })
    } catch {
      /* ignore — version stays empty */
    }
  },

  checkForUpdates: async () => {
    if (!isTauri()) return
    set({ status: 'checking', errorMsg: '' })
    try {
      const { check } = await import('@tauri-apps/plugin-updater')
      const update = await check()
      if (update) {
        set({
          updateInfo: {
            version: update.version,
            date: update.date ?? '',
            body: update.body ?? '',
          },
          status: 'available',
        })
      } else {
        set({ status: 'not-available', updateInfo: null })
      }
    } catch (err) {
      set({ errorMsg: String(err), status: 'error' })
    }
  },

  downloadAndInstall: async () => {
    if (!isTauri()) return
    set({ status: 'downloading', errorMsg: '', downloadProgress: 0 })
    try {
      const { check } = await import('@tauri-apps/plugin-updater')
      const { relaunch } = await import('@tauri-apps/plugin-process')

      const update = await check()
      if (!update) {
        set({ status: 'not-available' })
        return
      }

      let total = 0
      let downloaded = 0
      await update.downloadAndInstall((event) => {
        switch (event.event) {
          case 'Started':
            total = event.data.contentLength ?? 0
            break
          case 'Progress':
            downloaded += event.data.chunkLength
            if (total > 0) {
              set({ downloadProgress: Math.round((downloaded / total) * 100) })
            }
            break
          case 'Finished':
            set({ downloadProgress: 100 })
            break
        }
      })

      set({ status: 'installed' })
      // Relaunch after a short pause so the UI can show "restarting"
      setTimeout(async () => {
        try {
          await relaunch()
        } catch {
          /* ignore */
        }
      }, 800)
    } catch (err) {
      set({ errorMsg: String(err), status: 'error' })
    }
  },

  dismiss: () => {
    set({ status: 'idle', updateInfo: null })
  },
}))
