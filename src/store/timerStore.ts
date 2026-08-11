// ──────────────────────────────────────────────
// ZenTimer — Timer Store
// The heart of the app: manages the pomodoro cycle,
// countdown logic, phase transitions, and buffer breaks.
// ──────────────────────────────────────────────

import { create } from 'zustand'
import type { TimerPhase, TimerStatus, Settings } from '@/types'
import { minutesToSeconds } from '@/utils/time'
import { randomInt } from '@/utils/random'
import { audioEngine } from '@/utils/audio'
import { useSettingsStore } from './settingsStore'

interface TimerStore {
  // ── State ──
  phase: TimerPhase
  status: TimerStatus
  remaining: number       // seconds
  total: number           // seconds (current phase total)
  completedSessions: number
  currentFocusDuration: number  // seconds (the actual chosen duration)
  lastSettings: Settings | null

  // ── Internal ──
  _intervalId: ReturnType<typeof setInterval> | null
  _bufferTime: number  // seconds into focus when buffer triggers
  _startInterval: () => void

  // ── Actions ──
  start: () => void
  pause: () => void
  resume: () => void
  toggle: () => void
  reset: () => void
  skip: () => void
  tick: () => void
  setPhase: (phase: TimerPhase) => void
}

/** Compute the actual focus duration based on settings */
function computeFocusDuration(settings: Settings): number {
  if (settings.selectionMode === 'fixed') {
    return minutesToSeconds(settings.fixedDuration)
  }
  // Random mode: pick a random minute between min and max
  const minutes = randomInt(settings.randomMin, settings.randomMax)
  return minutesToSeconds(minutes)
}

/** Compute a buffer trigger time (in seconds) within the focus session.
 *  Fixed mode: triggers at exactly bufferMinMinute * 60.
 *  Random mode: random between min and max. */
function computeBufferTime(settings: Settings, focusDurationSec: number): number {
  const triggerSec = settings.bufferMinMinute * 60
  if (settings.bufferMode === 'fixed') {
    return triggerSec < focusDurationSec - 30 ? triggerSec : -1
  }
  const maxSec = settings.bufferMaxMinute * 60
  const upperBound = Math.min(maxSec, focusDurationSec - 30)
  const lowerBound = Math.min(triggerSec, upperBound)
  if (lowerBound >= upperBound) return -1
  return randomInt(lowerBound, upperBound)
}

/**
 * Compute the NEXT buffer trigger offset (seconds into focus) after the
 * current one. Micro breaks fire repeatedly throughout a focus session.
 * Fixed mode: adds a fixed interval each time.
 * Random mode: adds a random interval in [min, max] minutes.
 */
function computeNextBufferTime(
  settings: Settings,
  currentOffset: number,
  focusDurationSec: number,
): number {
  const addSec = settings.bufferMode === 'fixed'
    ? settings.bufferMinMinute * 60
    : randomInt(settings.bufferMinMinute * 60, settings.bufferMaxMinute * 60)
  const next = currentOffset + addSec
  const upperBound = focusDurationSec - 30
  if (next > upperBound) return -1
  return next
}

/** Micro-break duration is always a fixed value (seconds) */
function computeBufferDuration(settings: Settings): number {
  return settings.bufferSeconds
}

export const useTimerStore = create<TimerStore>((set, get) => {
  // Reconstitute a finished focus session → transition to break
  const completeFocus = (state: TimerStore) => {
    audioEngine.play('complete')
    const settings = useSettingsStore.getState().settings
    const breakDuration = minutesToSeconds(settings.breakDuration)
    if (settings.autoStartBreak) {
      set({
        phase: 'break',
        status: 'running',
        remaining: breakDuration,
        total: breakDuration,
        completedSessions: state.completedSessions + 1,
        _intervalId: null,
      })
      get()._startInterval()
    } else {
      set({
        phase: 'break',
        status: 'paused',
        remaining: breakDuration,
        total: breakDuration,
        completedSessions: state.completedSessions + 1,
        _intervalId: null,
      })
    }
  }

  // Start a fresh focus session using current settings
  const startNextFocus = (settings: Settings) => {
    const focusDuration = computeFocusDuration(settings)
    const bufferTime = settings.bufferEnabled
      ? computeBufferTime(settings, focusDuration)
      : -1
    set({
      phase: 'focus',
      status: 'running',
      remaining: focusDuration,
      total: focusDuration,
      currentFocusDuration: focusDuration,
      _bufferTime: bufferTime,
      _intervalId: null,
    })
    get()._startInterval()
  }

  return {
  // ── Initial state ──
  phase: 'idle',
  status: 'stopped',
  remaining: 0,
  total: 0,
  completedSessions: 0,
  currentFocusDuration: 0,
  lastSettings: null,
  _intervalId: null,
  _bufferTime: -1,

  // ── Actions ──
  start: () => {
    const settings = useSettingsStore.getState().settings
    const focusDuration = computeFocusDuration(settings)
    const bufferTime = settings.bufferEnabled
      ? computeBufferTime(settings, focusDuration)
      : -1

    audioEngine.unlock()
    audioEngine.play('start')

    set({
      phase: 'focus',
      status: 'running',
      remaining: focusDuration,
      total: focusDuration,
      currentFocusDuration: focusDuration,
      lastSettings: { ...settings },
      _bufferTime: bufferTime,
    })

    get()._startInterval()
  },

  pause: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    set({ status: 'paused', _intervalId: null })
  },

  resume: () => {
    audioEngine.unlock()
    set({ status: 'running' })
    get()._startInterval()
  },

  toggle: () => {
    const { status } = get()
    if (status === 'running') {
      get().pause()
    } else if (status === 'paused') {
      get().resume()
    }
  },

  reset: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    set({
      phase: 'idle',
      status: 'stopped',
      remaining: 0,
      total: 0,
      _bufferTime: -1,
      _intervalId: null,
    })
  },

  skip: () => {
    const state = get()
    const { _intervalId } = state
    if (_intervalId) clearInterval(_intervalId)

    if (state.phase === 'focus') {
      // Skip to break
      const settings = useSettingsStore.getState().settings
      const breakDuration = minutesToSeconds(settings.breakDuration)
      set({
        phase: 'break',
        status: 'running',
        remaining: breakDuration,
        total: breakDuration,
        _intervalId: null,
      })
      get()._startInterval()
    } else if (state.phase === 'break' || state.phase === 'buffer') {
      // Skip to idle (or auto-start next focus)
      const settings = useSettingsStore.getState().settings
      if (settings.autoStartFocus && state.lastSettings) {
        const focusDuration = computeFocusDuration(settings)
        const bufferTime = settings.bufferEnabled
          ? computeBufferTime(settings, focusDuration)
          : -1
        set({
          phase: 'focus',
          status: 'running',
          remaining: focusDuration,
          total: focusDuration,
          currentFocusDuration: focusDuration,
          _bufferTime: bufferTime,
          _intervalId: null,
        })
        get()._startInterval()
      } else {
        set({
          phase: 'idle',
          status: 'stopped',
          remaining: 0,
          total: 0,
          _intervalId: null,
        })
      }
    }
  },

  tick: () => {
    const state = get()
    if (state.status !== 'running') return
    const settings = useSettingsStore.getState().settings

    // ── Buffer phase (micro-break) ──
    if (state.phase === 'buffer') {
      const newBufRemaining = state.remaining - 1

      if (settings.bufferCountsAsFocus) {
        // Focus time keeps flowing underneath the micro-break
        const newFocusRemaining = _focusResumeRemaining - 1

        // Focus finishes during the micro-break → cut it short, go to break
        if (newFocusRemaining <= 0) {
          completeFocus(state)
          return
        }
        // Micro-break ends → resume focus with the continuously-decremented time
        if (newBufRemaining <= 0) {
          audioEngine.play('chime')
          const nextBufferTime = computeNextBufferTime(
            settings,
            state._bufferTime,
            state.currentFocusDuration,
          )
          _focusResumeRemaining = newFocusRemaining
          set({
            phase: 'focus',
            remaining: newFocusRemaining,
            total: _focusResumeTotal,
            _bufferTime: nextBufferTime,
          })
          return
        }
        // Both count down together
        _focusResumeRemaining = newFocusRemaining
        set({ remaining: newBufRemaining })
        return
      }

      // Focus frozen during the micro-break (original behaviour)
      if (newBufRemaining <= 0) {
        audioEngine.play('chime')
        const nextBufferTime = computeNextBufferTime(
          settings,
          state._bufferTime,
          state.currentFocusDuration,
        )
        set({
          phase: 'focus',
          remaining: _focusResumeRemaining,
          total: _focusResumeTotal,
          _bufferTime: nextBufferTime,
        })
        return
      }
      set({ remaining: newBufRemaining })
      return
    }

    // ── Focus / Break counting ──
    const newRemaining = state.remaining - 1

    // Buffer trigger during focus
    if (state.phase === 'focus' && state._bufferTime > 0) {
      const elapsed = state.total - newRemaining
      if (elapsed >= state._bufferTime) {
        audioEngine.play('ding')
        const duration = computeBufferDuration(settings)
        // Remember focus progress so we can resume after the break
        _focusResumeRemaining = newRemaining
        _focusResumeTotal = state.total
        set({
          phase: 'buffer',
          remaining: duration,
          total: duration,
        })
        return
      }
    }

    // ── Phase complete ──
    if (newRemaining <= 0) {
      const { _intervalId } = get()
      if (_intervalId) clearInterval(_intervalId)

      if (state.phase === 'focus') {
        completeFocus(state)
      } else if (state.phase === 'break') {
        audioEngine.play('complete')
        if (settings.autoStartFocus) {
          startNextFocus(settings)
        } else {
          set({
            phase: 'idle',
            status: 'stopped',
            remaining: 0,
            total: 0,
            _intervalId: null,
          })
        }
      }
      return
    }

    // ── Normal tick ──
    set({ remaining: newRemaining })
  },

  setPhase: (phase: TimerPhase) => set({ phase }),

  // ── Internal: start interval ──
  _startInterval: () => {
    const { _intervalId } = get()
    if (_intervalId) clearInterval(_intervalId)
    const id = setInterval(() => {
      get().tick()
    }, 1000)
    set({ _intervalId: id })
  },
}})

// Module-level variables to track focus resumption after buffer
let _focusResumeRemaining = 0
let _focusResumeTotal = 0
