// ──────────────────────────────────────────────
// FloatingWindowButton — Toggle the PiP mini window
// Rendered inline in home view (never hidden/missed)
// ──────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PictureInPicture2, X } from 'lucide-react'

interface FloatingWindowButtonProps {
  isOpen: boolean
  onToggle: () => void
}

export function FloatingWindowButton({ isOpen, onToggle }: FloatingWindowButtonProps) {
  const [showHint, setShowHint] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center gap-2 mt-6 w-full max-w-md mx-auto">
      {/* Hint tooltip */}
      <AnimatePresence>
        {showHint && !isOpen && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-amber-400 font-medium"
          >
            💡 点击下方按钮可开启悬浮小窗，随时查看计时
          </motion.p>
        )}
      </AnimatePresence>

      {/* Main button — prominent inline pill */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          boxShadow: isOpen
            ? '0 0 24px rgba(245,158,11,0.35)'
            : '0 4px 24px rgba(139,92,246,0.35), 0 0 0 1px rgba(139,92,246,0.3)',
        }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onToggle}
        className={`flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300 w-full ${
          isOpen
            ? 'bg-focus-500/90 text-white shadow-lg shadow-focus-500/30'
            : 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25'
        }`}
        title={isOpen ? '关闭悬浮窗' : '开启悬浮窗'}
      >
        <motion.span
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {isOpen ? <X size={18} /> : <PictureInPicture2 size={18} />}
        </motion.span>
        <span>{isOpen ? '关闭悬浮小窗' : '✨ 开启悬浮小窗'}</span>
      </motion.button>
    </div>
  )
}
