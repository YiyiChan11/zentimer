// ──────────────────────────────────────────────
// CircularTimer — The centerpiece SVG progress ring (i18n ready)
// ──────────────────────────────────────────────

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatTime, getProgress } from '@/utils/time'
import { useT } from '@/i18n/useT'
import type { TimerPhase } from '@/types'

const PHASE_KEYS: Record<TimerPhase, { main: string; sub: string }> = {
  idle:   { main: 'phaseReady',   sub: 'phaseReadyEn' },
  focus:  { main: 'phaseFocus',   sub: 'phaseFocusEn' },
  break:  { main: 'phaseBreak',   sub: 'phaseBreakEn' },
  buffer: { main: 'phaseBuffer',  sub: 'phaseBufferEn' },
}

export function CircularTimer({ remaining, total, phase }: CircularTimerProps) {
  const progress = getProgress(remaining, total)
  const radius = 180
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - progress)
  const { t, locale } = useT()

  const colors = useMemo(() => {
    switch (phase) {
      case 'focus':
        return { ring: '#f9a93c', glow: 'rgba(249, 169, 60, 0.25)', text: '#f9a93c' }
      case 'break':
        return { ring: '#63a19d', glow: 'rgba(99, 161, 157, 0.25)', text: '#63a19d' }
      case 'buffer':
        return { ring: '#fbc574', glow: 'rgba(251, 197, 116, 0.3)', text: '#fbc574' }
      default:
        return { ring: '#827b70', glow: 'rgba(130, 123, 112, 0.15)', text: '#f7f6f4' }
    }
  }, [phase])

  const labels = PHASE_KEYS[phase]

  return (
    <div
      className="relative flex items-center justify-center w-[min(300px,75vw)] h-[min(300px,75vw)]"
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000"
        style={{ background: colors.glow, scale: phase === 'idle' ? 0.8 : 1 }}
      />

      <svg
        viewBox="0 0 420 420"
        className="relative w-full h-full -rotate-90"
      >
        {/* Background track */}
        <circle
          cx="210"
          cy="210"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="3"
        />

        {/* Tick marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 2 * Math.PI - Math.PI / 2
          const inner = radius - 12
          const outer = radius - (i % 5 === 0 ? 20 : 16)
          const x1 = 210 + inner * Math.cos(angle)
          const y1 = 210 + inner * Math.sin(angle)
          const x2 = 210 + outer * Math.cos(angle)
          const y2 = 210 + outer * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.06)"
              strokeWidth={i % 5 === 0 ? 1.5 : 0.8}
            />
          )
        })}

        {/* Progress ring */}
        <motion.circle
          cx="210"
          cy="210"
          r={radius}
          fill="none"
          stroke={colors.ring}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 12px ${colors.glow})` }}
        />

        {/* Progress dot at the end of the ring */}
        {progress > 0 && progress < 1 && (
          <circle
            cx={210 + radius * Math.cos(progress * 2 * Math.PI - Math.PI / 2)}
            cy={210 + radius * Math.sin(progress * 2 * Math.PI - Math.PI / 2)}
            r="6"
            fill={colors.ring}
            style={{ filter: `drop-shadow(0 0 8px ${colors.ring})` }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-3 flex flex-col items-center"
        >
          <span
            className="text-xs font-medium uppercase tracking-[0.3em]"
            style={{ color: colors.text }}
          >
            {t(labels.main)}
          </span>
          <span className="text-[10px] text-ink-400 tracking-[0.2em] mt-0.5">
            {t(labels.sub)}
          </span>
        </motion.div>

        <motion.div
          key={remaining}
          className="text-[clamp(3rem,12vw,4.5rem)] font-light tabular text-ink-50 leading-none"
          style={{ fontFeatureSettings: '"tnum"', letterSpacing: '-0.02em' }}
        >
          {formatTime(remaining > 0 ? remaining : 0)}
        </motion.div>

        <div className="mt-4 flex items-center gap-2">
          <div
            className="h-1 w-1 rounded-full animate-pulse"
            style={{ background: colors.ring }}
          />
          <span className="text-xs text-ink-400">
            {phase === 'idle'
              ? (locale === 'zh' ? '选择时间开始专注' : 'Select time to start focus')
              : `${Math.round(progress * 100)}% ${locale === 'zh' ? '已完成' : 'done'}`}
          </span>
        </div>
      </div>
    </div>
  )
}

interface CircularTimerProps {
  remaining: number
  total: number
  phase: TimerPhase
}
