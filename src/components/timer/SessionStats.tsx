// ──────────────────────────────────────────────
// SessionStats — Compact session counter (i18n)
// ──────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { useT } from '@/i18n/useT'

interface SessionStatsProps {
  completed: number
}

export function SessionStats({ completed }: SessionStatsProps) {
  const { t } = useT()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="flex items-center gap-3 text-sm"
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
        <Flame size={13} className={completed > 0 ? 'text-focus-400' : 'text-ink-600'} />
        <span
          className="text-ink-300"
          dangerouslySetInnerHTML={{
            __html: t('sessionStats', {
              count: String(completed),
            }).replace(
              '{count}',
              `<span class="text-ink-100 tabular font-medium">${completed}</span>`,
            ),
          }}
        />
      </div>
    </motion.div>
  )
}
