// ──────────────────────────────────────────────
// TimerControls — Start / Pause / Reset / Skip (i18n ready)
// Smooth layout transition: idle→focus causes the main
// button to gently slide down as it becomes Pause/Resume.
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Check } from 'lucide-react'
import { useTimerStore } from '@/store/timerStore'
import { useT } from '@/i18n/useT'

export function TimerControls() {
  const { phase, status, start, pause, resume, reset, skip } = useTimerStore()
  const { t } = useT()
  const isIdle = phase === 'idle'
  const isRunning = status === 'running'

  return (
    <motion.div
      layout
      className="flex items-center gap-4"
      // Smooth shift when side buttons appear/disappear
      transition={{ type: 'spring', damping: 22, stiffness: 200 }}
    >
      {/* Reset button (left) — fades in when not idle */}
      <AnimatePresence>
        {!isIdle && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={reset}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-white/5 transition-all"
            title={t('reset')}
          >
            <RotateCcw size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main action button — slides down smoothly on idle→focus */}
      <motion.button
        layout
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={isIdle ? start : (isRunning ? pause : resume)}
        className={`px-10 py-4 rounded-full font-semibold text-lg shadow-lg flex items-center gap-2.5 transition-colors ${
          isIdle || (!isRunning && !isIdle)
            ? 'bg-focus-500 text-ink-950 shadow-focus-500/20 hover:bg-focus-400'
            : 'glass text-ink-100 hover:bg-white/5'
        }`}
        // Gentle spring-driven position shift when content changes
        transition={{
          layout: { type: 'spring', damping: 22, stiffness: 200 },
          default: { duration: 0.2 },
        }}
      >
        {isIdle ? (
          <>
            <Play size={20} fill="currentColor" />
            {t('startFocus')}
          </>
        ) : isRunning ? (
          <>
            <Pause size={20} fill="currentColor" />
            {t('pause')}
          </>
        ) : (
          <>
            <Play size={20} fill="currentColor" />
            {t('resume')}
          </>
        )}
      </motion.button>

      {/* Skip button (right) — fades in when not idle */}
      <AnimatePresence>
        {!isIdle && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={skip}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-white/5 transition-all"
            title={phase === 'focus' ? t('skipToBreak') : t('skipToNext')}
          >
            {phase === 'focus' ? <SkipForward size={18} /> : <Check size={18} />}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
