// ──────────────────────────────────────────────
// Tauri API bridge — connects React frontend to Rust backend
// Falls back gracefully when running in browser (no Tauri)
//
// Uses __TAURI_INTERNALS__ (always available in Tauri 2.0)
// instead of __TAURI__ (requires withGlobalTauri: true)
// ──────────────────────────────────────────────

type TauriInternals = {
  invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>
}

function getTauriInternals(): TauriInternals | null {
  if (typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window) {
    return (window as unknown as { __TAURI_INTERNALS__: TauriInternals }).__TAURI_INTERNALS__
  }
  return null
}

export const isTauri = (): boolean => getTauriInternals() !== null

/** Show the native floating window */
export async function showFloatingWindow(): Promise<void> {
  const internals = getTauriInternals()
  if (!internals) throw new Error('Tauri API not available')
  await internals.invoke('show_floating_window')
}

/** Hide the native floating window */
export async function hideFloatingWindow(): Promise<void> {
  const internals = getTauriInternals()
  if (!internals) throw new Error('Tauri API not available')
  await internals.invoke('hide_floating_window')
}

/** Update floating window timer display */
export async function updateFloatingTimer(
  time: string,
  phase: string,
  progress: number,
): Promise<void> {
  const internals = getTauriInternals()
  if (!internals) return
  try {
    await internals.invoke('update_floating_timer', { time, phase, progress })
  } catch {
    // Silent fail — this is called every second
  }
}

/** Set the floating window opacity (0.0–1.0) */
export async function setFloatingOpacity(opacity: number): Promise<void> {
  const internals = getTauriInternals()
  if (!internals) return
  try {
    await internals.invoke('set_floating_opacity', { opacity })
  } catch {
    // Silent fail — opacity is non-critical
  }
}
