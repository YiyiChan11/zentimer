// ──────────────────────────────────────────────
// Time utilities
// ──────────────────────────────────────────────

/** Format seconds as MM:SS */
export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.ceil(seconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

/** Format seconds as a human-readable string */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}秒`
  if (s === 0) return `${m}分钟`
  return `${m}分${s}秒`
}

/** Convert minutes to seconds */
export function minutesToSeconds(min: number): number {
  return Math.round(min * 60)
}

/** Get progress ratio 0–1 */
export function getProgress(remaining: number, total: number): number {
  if (total <= 0) return 0
  return 1 - remaining / total
}
