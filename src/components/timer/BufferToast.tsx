// ──────────────────────────────────────────────
// BufferToast — Toast notification during buffer break
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Droplets, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

const TIPS = [
  { icon: <Droplets size={16} />, text: '喝一口水' },
  { icon: <Eye size={16} />, text: '闭目养神' },
  { icon: <Coffee size={16} />, text: '伸展一下' },
]

interface BufferToastProps {
  show: boolean
  remaining: number
}

export function BufferToast({ show, remaining }: BufferToastProps) {
  const [tipIndex, setTipIndex] = useState(0)

  useEffect(() => {
    if (show) {
      setTipIndex(Math.floor(Math.random() * TIPS.length))
    }
  }, [show])

  const tip = TIPS[tipIndex]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
        >
          <div className="glass-strong rounded-2xl px-6 py-4 flex items-center gap-4 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-focus-500/15 flex items-center justify-center text-focus-300">
              {tip.icon}
            </div>
            <div>
              <p className="text-sm text-ink-100 font-medium">
                {tip.text}
              </p>
              <p className="text-xs text-ink-400 mt-0.5">
                微休息 · {remaining}s 后继续
              </p>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-focus-400/30 flex items-center justify-center">
              <span className="text-xs text-focus-300 tabular">{remaining}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
