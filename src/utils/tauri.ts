// ──────────────────────────────────────────────
// Tauri API bridge — connects React frontend to Rust backend
// Falls back gracefully when running in browser (no Tauri)
// ──────────────────────────────────────────────

type TauriAPI = {
  invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>
  event: {
    listen: (event: string, handler: (e: { payload: unknown }) => void) => Promise<() => void>
  }
  window: {
    getCurrent: () => {
      hide: () => Promise<void>
      show: () => Promise<void>
      setAlwaysOnTop: (v: boolean) => Promise<void>
    }
  }
}

function getTauriAPI(): TauriAPI | null {
  if (typeof window !== 'undefined' && '__TAURI__' in window) {
    return (window as unknown as { __TAURI__: TauriAPI }).__TAURI__
  }
  return null
}

export const isTauri = (): boolean => getTauriAPI() !== null

/** Show the native floating window */
export async function showFloatingWindow(): Promise<void> {
  const api = getTauriAPI()
  if (!api) return
  try {
    await api.invoke('show_floating_window')
  } catch (e) {
    console.error('[Tauri] showFloatingWindow failed:', e)
  }
}

/** Hide the native floating window */
export async function hideFloatingWindow(): Promise<void> {
  const api = getTauriAPI()
  if (!api) return
  try {
    await api.invoke('hide_floating_window')
  } catch (e) {
    console.error('[Tauri] hideFloatingWindow failed:', e)
  }
}

/** Update floating window timer display */
export async function updateFloatingTimer(
  time: string,
  phase: string,
  progress: number,
): Promise<void> {
  const api = getTauriAPI()
  if (!api) return
  try {
    await api.invoke('update_floating_timer', { time, phase, progress })
  } catch (e) {
    // Silent fail — this is called every second
  }
}
