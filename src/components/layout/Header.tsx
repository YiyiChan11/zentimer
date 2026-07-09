// ──────────────────────────────────────────────
// Header — Top navigation with logo and links
// ──────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Settings, Download } from 'lucide-react'

interface HeaderProps {
  onOpenSettings: () => void
  onNavigateDownload: () => void
  onNavigateHome: () => void
  currentView: 'home' | 'download'
}

export function Header({ onOpenSettings, onNavigateDownload, onNavigateHome, currentView }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 group"
        >
          {/* Logo mark — Zen Enso */}
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" className="w-8 h-8">
              <defs>
                <linearGradient id="logoGrad" x1="10%" y1="12%" x2="90%" y2="88%">
                  <stop offset="0%" stopColor="#f9a93c"/>
                  <stop offset="55%" stopColor="#e88d1a"/>
                  <stop offset="100%" stopColor="#2dd4bf"/>
                </linearGradient>
              </defs>
              {/* Dark bg circle */}
              <circle cx="16" cy="16" r="14.5" fill="#1a1613"/>
              {/* Enso ring */}
              <circle cx="16" cy="16" r="10"
                fill="none" stroke="url(#logoGrad)"
                strokeWidth="2.4" strokeLinecap="round"
                strokeDasharray="57 6"
                transform="rotate(-78 16 16)"/>
              {/* Center dot */}
              <circle cx="16" cy="16" r="1.6" fill="#f9a93c" opacity="0.92"/>
            </svg>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-sm font-semibold text-ink-100 tracking-wide">
              ZenTimer
            </span>
            <span className="text-[9px] text-ink-500 tracking-[0.15em] uppercase mt-0.5">
              禅意番茄钟
            </span>
          </div>
        </motion.button>

        {/* Right actions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          {currentView === 'download' && (
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 rounded-full glass text-sm text-ink-200 hover:text-ink-50 hover:bg-white/5 transition-all"
            >
              返回计时
            </button>
          )}
          <button
            onClick={onNavigateDownload}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentView === 'download'
                ? 'glass text-focus-300'
                : 'glass text-ink-300 hover:text-ink-100 hover:bg-white/5'
            }`}
            title="下载"
          >
            <Download size={17} />
          </button>
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-white/5 transition-all"
            title="设置"
          >
            <Settings size={17} />
          </button>
        </motion.div>
      </div>
    </header>
  )
}
