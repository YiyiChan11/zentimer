import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { TimeSelector } from '@/components/timer/TimeSelector'
import { SessionStats } from '@/components/timer/SessionStats'
import { BufferToast } from '@/components/timer/BufferToast'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { DownloadPage } from '@/components/download/DownloadPage'
import { FloatingWindowButton } from '@/components/floating/FloatingWindowButton'
import { useTimerStore } from '@/store/timerStore'
import { useFloatingWindow } from '@/hooks/useFloatingWindow'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useT } from '@/i18n/useT'

// Phase labels for document title (simple, no i18n needed for title)
const PHASE_TITLE_ZH: Record<string, string> = {
  focus: '专注',
  break: '休息',
  buffer: '微休息',
}
const PHASE_TITLE_EN: Record<string, string> = {
  focus: 'Focus',
  break: 'Break',
  buffer: 'Buffer',
}

type View = 'home' | 'download'

function App() {
  const [view, setView] = useState<View>('home')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { phase, remaining, total, completedSessions } = useTimerStore()
  const floatingWindow = useFloatingWindow()
  const { t, locale } = useT()
  useKeyboardShortcuts()

  // Update body background class based on phase
  useEffect(() => {
    document.body.className = `mode-${phase}`
  }, [phase])

  // Update document title with timer
  useEffect(() => {
    if (phase === 'idle') {
      document.title = t('appTitle')
    } else {
      const m = Math.floor(remaining / 60)
      const s = remaining % 60
      const time = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      const labelMap = locale === 'zh' ? PHASE_TITLE_ZH : PHASE_TITLE_EN
      const label = labelMap[phase] ?? phase
      document.title = `${time} · ${label} — ZenTimer`
    }
  }, [phase, remaining, locale, t])

  return (
    <div className="min-h-screen relative noise-overlay">
      <Header
        onOpenSettings={() => setSettingsOpen(true)}
        onNavigateDownload={() => setView('download')}
        onNavigateHome={() => setView('home')}
        currentView={view}
      />

      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.main
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-12"
          >
            {/* Session counter */}
            <div className="mb-8">
              <SessionStats completed={completedSessions} />
            </div>

            {/* Circular timer */}
            <CircularTimer remaining={remaining} total={total} phase={phase} />

            {/* Controls or selector */}
            <div className="mt-10 flex flex-col items-center gap-8 w-full max-w-md">
              {phase === 'idle' ? (
                <>
                  <TimeSelector />
                  <TimerControls />
                </>
              ) : (
                <TimerControls />
              )}
            </div>

            {/* Quote */}
            {phase === 'idle' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-16 text-sm text-ink-500 italic font-serif"
              >
                {t('quote')}
              </motion.p>
            )}
          </motion.main>
        ) : (
          <motion.main
            key="download"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DownloadPage onNavigateHome={() => setView('home')} />
          </motion.main>
        )}
      </AnimatePresence>

      {/* Floating window button */}
      {view === 'home' && (
        <FloatingWindowButton
          isOpen={floatingWindow.isOpen}
          onToggle={() => (floatingWindow.isOpen ? floatingWindow.close() : floatingWindow.open())}
          supported={floatingWindow.supported}
        />
      )}

      {/* Buffer toast */}
      <BufferToast show={phase === 'buffer'} remaining={remaining} />

      {/* Settings panel */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default App
