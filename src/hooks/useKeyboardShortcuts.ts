// ──────────────────────────────────────────────
// useKeyboardShortcuts — Space: start/pause, Esc: reset
// ──────────────────────────────────────────────

import { useEffect } from 'react'
import { useTimerStore } from '@/store/timerStore'

export function useKeyboardShortcuts() {
  const { phase, status, start, pause, resume, reset } = useTimerStore()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (phase === 'idle') start()
          else if (status === 'running') pause()
          else if (status === 'paused') resume()
          break
        case 'Escape':
          if (phase !== 'idle') reset()
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, status, start, pause, resume, reset])
}
