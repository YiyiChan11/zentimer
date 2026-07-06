// ──────────────────────────────────────────────
// FloatingWindowButton — Toggle floating mini window
// Style matches TimerControls secondary buttons (glass circular)
// Positioned fixed at bottom-right corner of window
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { PictureInPicture2, X } from 'lucide-react'

interface FloatingWindowButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingWindowButton({ isOpen, onToggle }: FloatingWindowButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? 'bg-focus-500/20 text-focus-400 border border-focus-500/30 shadow-lg shadow-focus-500/15'
          : 'glass text-ink-400 hover:text-ink-200 hover:bg-white/5'
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
            transition={{ duration: 0.15 }}
          >
            <X size={18} />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <PictureInPicture2 size={18} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
