// ──────────────────────────────────────────────
// FloatingWindowButton — Toggle the PiP mini window
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { PictureInPicture2, X } from 'lucide-react'

interface FloatingWindowButtonProps {
  isOpen: boolean
  onToggle: () => void
  supported: boolean
}

export function FloatingWindowButton({ isOpen, onToggle, supported }: FloatingWindowButtonProps) {
  if (!supported) return null

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
        isOpen
          ? 'bg-focus-500 text-ink-950 shadow-focus-500/30'
          : 'glass text-ink-300 hover:text-ink-100 hover:bg-white/5'
      }`}
      title={isOpen ? '关闭悬浮窗' : '开启悬浮窗'}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
          >
            <X size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
          >
            <PictureInPicture2 size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
