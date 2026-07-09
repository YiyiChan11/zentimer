import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { CircularTimer } from '@/components/timer/CircularTimer'
import { TimerControls } from '@/components/timer/TimerControls'
import { TimeSelector } from '@/components/timer/TimeSelector'
import { SessionStats } from '@/components/timer/SessionStats'
import { BufferToast } from '@/components/timer/BufferToast'
import { SettingsPanel } from '@/components/settings/SettingsPanel'
import { UpdateNotification } from '@/components/settings/UpdateNotification'
import { DownloadPage } from '@/components/download/DownloadPage'
import { FloatingWindowButton } from '@/components/floating/FloatingWindowButton'
import { useTimerStore } from '@/store/timerStore'
import { useFloatingWindow } from '@/hooks/useFloatingWindow'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useT } from '@/i18n/useT'
import { isTauri } from '@/utils/tauri'
import { listen } from '@tauri-apps/api/event'
import { useUpdaterStore } from '@/store/updaterStore'

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

  // Listen for actions triggered from the native floating window
  // (single tap → pause/resume, or start focus when idle).
  // Double tap → open main is handled in Rust.
  useEffect(() => {
    if (!isTauri()) return
    let unlisten: (() => void) | undefined
    listen('floating-toggle', () => {
      const store = useTimerStore.getState()
      if (store.phase === 'idle') {
        store.start()
      } else {
        store.toggle()
      }
    })
      .then((u) => {
        unlisten = u
      })
      .catch(() => {})
    return () => {
      unlisten?.()
    }
  }, [])

  // Auto-update: fetch version + check once on startup (Tauri only)
  useEffect(() => {
    if (!isTauri()) return
    const store = useUpdaterStore.getState()
    store.init()
    const timer = setTimeout(() => store.checkForUpdates(), 2000)
    return () => clearTimeout(timer)
  }, [])

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
            className="h-screen flex flex-col items-center justify-start px-6 pt-14 pb-12 overflow-y-auto"
          >
            {/* Session counter */}
            <div className="mb-2 shrink-0">
              <SessionStats completed={completedSessions} />
            </div>

            {/* Circular timer — SINGLE unified animation source for position + size.

                idle   → compact near top, small ring (~230px)
                active → vertically centered, large ring (~420px)

                Both the container's physical dimensions (via animate) and its
                layout position (flex-1 vs static) are driven by ONE spring so
                scaling and moving are perfectly synchronized — no jump/stutter. */}
            <motion.div
              layout
              animate={{
                width: phase === 'idle' ? 'min(230px, 56vw)' : 'min(420px, 82vw)',
                height: phase === 'idle' ? 'min(230px, 56vw)' : 'min(420px, 82vw)',
              }}
              transition={phase === 'idle'
                // → shrink back to idle: snappy but not harsh
                ? { type: 'spring', damping: 26, stiffness: 260, mass: 0.7 }
                // → grow into focus: silky smooth, slightly slower for elegance
                : { type: 'spring', damping: 22, stiffness: 100, mass: 1.1 }}
              className={`flex flex-col items-center justify-center ${phase !== 'idle' ? 'flex-1 min-h-0' : ''}`}
            >
              <CircularTimer remaining={remaining} total={total} phase={phase} />
            </motion.div>

            {/* Controls — always at the bottom (shrink-0). TimerControls stays mounted
                across phases so Framer Motion's layout animation can smoothly
                slide Start Focus → Pause into place. */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md shrink-0">
              {/* Time selector — only in idle mode, with smooth enter/exit anim:
                  enter = rise up from below; exit = clump + fade downward */}
              <AnimatePresence>
                {phase === 'idle' && (
                  <motion.div
                    key="timeselector"
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 48, scale: 0.85 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-md"
                  >
                    <TimeSelector />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main controls: Start Focus / Pause / Reset / Skip */}
              <TimerControls />
            </div>

            {/* Quote */}
            {phase === 'idle' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-5 text-sm text-ink-500 italic font-serif shrink-0"
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

      {/* Floating window button — fixed bottom-right */}
      {view === 'home' && (
        <FloatingWindowButton
          isOpen={floatingWindow.isOpen}
          onToggle={() => (floatingWindow.isOpen ? floatingWindow.close() : floatingWindow.open())}
        />
      )}

      {/* Buffer toast */}
      <BufferToast show={phase === 'buffer'} remaining={remaining} />

      {/* Settings panel */}
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Auto-update notification */}
      <UpdateNotification />
    </div>
  )
}

export default App
