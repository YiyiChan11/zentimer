// ──────────────────────────────────────────────
// useUpdater — Check for app updates (Tauri only)
// ──────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react'
import { isTauri } from '@/utils/tauri'

export interface UpdateInfo {
  version: string
  date: string
  body: string
}

export type UpdateStatus = 'idle' | 'checking' | 'available' | 'not-available' | 'downloading' | 'installed' | 'error'

export function useUpdater() {
  const [status, setStatus] = useState<UpdateStatus>('idle')
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const checkedRef = useRef(false)

  // Auto-check on mount (Tauri only, once per session)
  useEffect(() => {
    if (!isTauri() || checkedRef.current) return
    checkedRef.current = true
    // Delay slightly so app loads first
    const timer = setTimeout(() => checkForUpdates(), 2000)
    return () => clearTimeout(timer)
  }, [])

  const checkForUpdates = useCallback(async () => {
    if (!isTauri()) return
    setStatus('checking')
    setErrorMsg('')
    try {
      const { check } = await import('@tauri-apps/plugin-updater')
      const update = await check()
      if (update) {
        setUpdateInfo({
          version: update.version,
          date: update.date ?? '',
          body: update.body ?? '',
        })
        setStatus('available')
      } else {
        setStatus('not-available')
      }
    } catch (err) {
      setErrorMsg(String(err))
      setStatus('error')
    }
  }, [])

  const downloadAndInstall = useCallback(async () => {
    if (!isTauri()) return
    setStatus('downloading')
    setErrorMsg('')
    setDownloadProgress(0)
    try {
      const { check } = await import('@tauri-apps/plugin-updater')
      const { relaunch } = await import('@tauri-apps/plugin-process')

      const update = await check()
      if (!update) {
        setStatus('not-available')
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
              setDownloadProgress(Math.round((downloaded / total) * 100))
            }
            break
          case 'Finished':
            setDownloadProgress(100)
            break
        }
      })

      setStatus('installed')
      // Auto-relaunch after a brief delay
      setTimeout(async () => {
        await relaunch()
      }, 500)
    } catch (err) {
      setErrorMsg(String(err))
      setStatus('error')
    }
  }, [])

  const dismiss = useCallback(() => {
    setStatus('idle')
    setUpdateInfo(null)
  }, [])

  return {
    status,
    updateInfo,
    downloadProgress,
    errorMsg,
    checkForUpdates,
    downloadAndInstall,
    dismiss,
  }
}
