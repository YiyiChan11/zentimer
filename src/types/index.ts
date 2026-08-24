// ──────────────────────────────────────────────
// ZenTimer — Type Definitions
// ──────────────────────────────────────────────

/** Timer phase — the current state of the pomodoro cycle */
export type TimerPhase = 'idle' | 'focus' | 'break' | 'buffer'

/** Whether the timer is actively counting down */
export type TimerStatus = 'stopped' | 'running' | 'paused'

/** Time selection mode */
export type SelectionMode = 'fixed' | 'random'

/** UI language */
export type Locale = 'zh' | 'en'

/** Complete settings object */
export interface Settings {
  /** Selection mode: fixed time or random range */
  selectionMode: SelectionMode
  /** Fixed duration in minutes (1–150, step 1) */
  fixedDuration: number
  /** Random range minimum in minutes (1–150, step 1) */
  randomMin: number
  /** Random range maximum in minutes (1–150, step 1) */
  randomMax: number
  /** Break duration in minutes (default 10) */
  breakDuration: number
  /** Whether buffer breaks are enabled */
  bufferEnabled: boolean
  /** Buffer trigger: random time between min-max min into focus */
  bufferMinMinute: number
  bufferMaxMinute: number
  /** Buffer trigger interval mode: fixed (every N min) or random (N–M min) */
  bufferMode: SelectionMode
  /** Buffer break duration in seconds (always fixed) */
  bufferSeconds: number
  /** When true, focus countdown keeps running during a micro-break;
   *  when false, focus pauses and resumes after the micro-break ends. */
  bufferCountsAsFocus: boolean
  /** Master volume 0–100 */
  volume: number
  /** Auto-start break after focus ends */
  autoStartBreak: boolean
  /** Auto-start next focus after break ends */
  autoStartFocus: boolean
  /** Floating window opacity (0.3–1.0) */
  floatingOpacity: number
  /** UI language */
  locale: Locale
}

/** Timer state snapshot */
export interface TimerState {
  phase: TimerPhase
  status: TimerStatus
  /** Remaining time in seconds */
  remaining: number
  /** Total duration of current phase in seconds */
  total: number
  /** Number of completed focus sessions */
  completedSessions: number
  /** The actual chosen focus duration (for random mode) */
  currentFocusDuration: number
  /** Last used settings (for "same as last time" behaviour) */
  lastSettings: Settings | null
}
