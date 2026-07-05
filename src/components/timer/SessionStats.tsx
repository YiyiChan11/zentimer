// ──────────────────────────────────────────────
// SessionStats — Compact session counter
// ──────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface SessionStatsProps {
  completed: number
}

export function SessionStats({ completed }: SessionStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex items-center gap-3 text-sm"
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
        <Flame size={13} className={completed > 0 ? 'text-focus-400' : 'text-ink-600'} />
        <span className="text-ink-300">
          今日 <span className="text-ink-100 tabular font-medium">{completed}</span> 轮
        </span>
      </div>
    </motion.div>
  )
}
