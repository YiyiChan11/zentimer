// ──────────────────────────────────────────────
// TimerControls — Start / Pause / Reset / Skip
// ──────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Check } from 'lucide-react'
import { useTimerStore } from '@/store/timerStore'

export function TimerControls() {
  const { phase, status, start, pause, resume, reset, skip } = useTimerStore()
  const isIdle = phase === 'idle'
  const isRunning = status === 'running'
  const isPaused = status === 'paused'

  return (
    <div className="flex items-center gap-4">
      {/* Reset button (left) */}
      {!isIdle && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={reset}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-white/5 transition-all"
          title="重置"
        >
          <RotateCcw size={18} />
        </motion.button>
      )}

      {/* Main action button */}
      {isIdle ? (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={start}
          className="px-10 py-4 rounded-full bg-focus-500 text-ink-950 font-semibold text-lg shadow-lg shadow-focus-500/20 hover:bg-focus-400 transition-colors flex items-center gap-2.5"
        >
          <Play size={20} fill="currentColor" />
          开始专注
        </motion.button>
      ) : isRunning ? (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={pause}
          className="px-10 py-4 rounded-full glass text-ink-100 font-semibold text-lg hover:bg-white/5 transition-all flex items-center gap-2.5"
        >
          <Pause size={20} fill="currentColor" />
          暂停
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={resume}
          className="px-10 py-4 rounded-full bg-focus-500 text-ink-950 font-semibold text-lg shadow-lg shadow-focus-500/20 hover:bg-focus-400 transition-colors flex items-center gap-2.5"
        >
          <Play size={20} fill="currentColor" />
          继续
        </motion.button>
      )}

      {/* Skip button (right) */}
      {!isIdle && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={skip}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-white/5 transition-all"
          title={phase === 'focus' ? '跳过到休息' : '跳过到下一轮'}
        >
          {phase === 'focus' ? <SkipForward size={18} /> : <Check size={18} />}
        </motion.button>
      )}
    </div>
  )
}
