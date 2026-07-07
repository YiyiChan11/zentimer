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

/** Compute a random buffer trigger time (in seconds) within the focus session */
function computeBufferTime(settings: Settings, focusDurationSec: number): number {
  const minSec = settings.bufferMinMinute * 60
  const maxSec = settings.bufferMaxMinute * 60
  // Ensure buffer doesn't happen too close to the end
  const upperBound = Math.min(maxSec, focusDurationSec - 30)
  const lowerBound = Math.min(minSec, upperBound)
  if (lowerBound >= upperBound) return -1 // can't place buffer
  return randomInt(lowerBound, upperBound)
}

/**
 * Compute the NEXT buffer trigger offset (seconds into focus) after the
 * current one. Micro breaks fire repeatedly throughout a focus session,
 * each spaced by a random interval in [min, max] minutes. Returns -1 when
 * the next one would land too close to the end of the session.
 */
function computeNextBufferTime(
  settings: Settings,
  currentOffset: number,
  focusDurationSec: number,
): number {
  const minSec = settings.bufferMinMinute * 60
  const maxSec = settings.bufferMaxMinute * 60
  const next = currentOffset + randomInt(minSec, maxSec)
  const upperBound = focusDurationSec - 30
  if (next > upperBound) return -1 // no more buffers this session
  return next
}

export const useTimerStore = create<TimerStore>((set, get) => ({
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

    const newRemaining = state.remaining - 1

    // ── Buffer trigger check (during focus) ──
    // Micro breaks can fire multiple times per focus session; each is
    // scheduled at a random offset computed when the previous one ends.
    if (state.phase === 'focus' && state._bufferTime > 0) {
      const elapsed = state.total - newRemaining
      if (elapsed >= state._bufferTime) {
        audioEngine.play('ding')
        // Enter buffer phase: pause the focus countdown, start micro-break
        const settings = useSettingsStore.getState().settings
        // Remember focus remaining/total so we can resume after the break
        _focusResumeRemaining = newRemaining
        _focusResumeTotal = state.total
        set({
          phase: 'buffer',
          remaining: settings.bufferSeconds,
          total: settings.bufferSeconds,
        })
        return
      }
    }

    // ── Buffer ended → resume focus and schedule the next one ──
    if (state.phase === 'buffer' && newRemaining <= 0) {
      audioEngine.play('chime')
      const settings = useSettingsStore.getState().settings
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

    // ── Phase complete ──
    if (newRemaining <= 0) {
      const { _intervalId } = get()
      if (_intervalId) clearInterval(_intervalId)

      if (state.phase === 'focus') {
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
      } else if (state.phase === 'break') {
        audioEngine.play('complete')
        const settings = useSettingsStore.getState().settings

        if (settings.autoStartFocus) {
          // Start next focus with same settings
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
}))

// Module-level variables to track focus resumption after buffer
let _focusResumeRemaining = 0
let _focusResumeTotal = 0
