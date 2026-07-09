import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
  const { phase, status, remaining, total, completedSessions } = useTimerStore()
  const floatingWindow = useFloatingWindow()
  const { t, locale } = useT()
  useKeyboardShortcuts()

  // Track viewport width so the ring size can be a NUMERIC pixel value.
  // Framer Motion cannot interpolate CSS `min()`/`calc()` strings, which was
  // the cause of the "grow → stutter → pop" jump. Numbers spring smoothly.
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 540))
  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── UNIFIED animation source ──────────────────────────────────────────
  // A SINGLE spring (`progress`: 0 = idle, 1 = focus) drives the ring's size,
  // its vertical position AND the time-font size. Every value is DERIVED from
  // this one MotionValue, so they are mathematically locked together and can
  // never desync — no end-of-transition jump, fully silky.
  const stageRef = useRef<HTMLDivElement>(null)
  const [stageH, setStageH] = useState(420)
  useEffect(() => {
    const measure = () => {
      const el = stageRef.current
      if (el) setStageH(el.clientHeight)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const idleSize = Math.min(230, vw * 0.56)
  const activeSize = Math.min(420, vw * 0.82)

  const progress = useSpring(0, { damping: 24, stiffness: 110, mass: 1 })
  useEffect(() => {
    progress.set(phase === 'idle' ? 0 : 1)
  }, [phase, progress])

  // Numeric size endpoints (reactive to viewport changes via MotionValues).
  const idleSizeMV = useMotionValue(idleSize)
  const activeSizeMV = useMotionValue(activeSize)
  useEffect(() => {
    idleSizeMV.set(idleSize)
    activeSizeMV.set(activeSize)
  }, [idleSize, activeSize, idleSizeMV, activeSizeMV])

  const ringSizeMV = useTransform(
    [progress, idleSizeMV, activeSizeMV],
    ([p, a, b]: number[]) => a + (b - a) * p,
  )
  // Font size tracks the ring size → digits grow WITH the ring, never jump.
  const fontMV = useTransform(ringSizeMV, (s: number) => Math.round(s * 0.2))

  // Vertical placement: the ring is anchored at the stage's vertical center
  // (top-1/2) and shifted UP while idle, gliding to center on focus. Driven by
  // the SAME spring → size growth and downward glide happen as one motion.
  const shiftUp = Math.max(110, stageH * 0.28)
  const shiftUpRef = useRef(shiftUp)
  shiftUpRef.current = shiftUp
  const ringY = useTransform(progress, (p: number) => -(shiftUpRef.current) * (1 - p))

  // TimeSelector sits just below the idle ring. Its own enter/exit animation
  // is fully independent (absolute) so it can never perturb the ring.
  const selectorOffsetRef = useRef(0)
  selectorOffsetRef.current = -shiftUp + idleSize / 2 + 20

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
            className="h-screen flex flex-col items-center px-6 pt-14 pb-12 overflow-hidden"
          >
            {/* Session counter */}
            <div className="mb-2 shrink-0">
              <SessionStats completed={completedSessions} />
            </div>

            {/* Stage — relative. Ring + selector are ABSOLUTELY positioned so
                their animations never couple to layout or to each other. */}
            <div ref={stageRef} className="relative flex-1 min-h-0 w-full">

              {/* Ring — anchored at the stage's vertical center (top-1/2),
                  shifted UP while idle. Its size AND its y-offset both derive
                  from ONE spring (progress) → they are perfectly matched and
                  animate as a single continuous, silky motion. No competing
                  springs, no layout-derived position, no end-of-transition jump. */}
              <motion.div
                className="absolute left-1/2 top-1/2 pointer-events-none"
                style={{ x: '-50%', y: ringY }}
              >
                <motion.div
                  className="-translate-y-1/2"
                  style={{ width: ringSizeMV, height: ringSizeMV }}
                >
                  <CircularTimer remaining={remaining} total={total} phase={phase} status={status} fontSizeMV={fontMV} />
                </motion.div>
              </motion.div>

              {/* Time selector — idle only, placed just below the idle ring.
                  Its own enter/exit animation is fully independent. */}
              <AnimatePresence>
                {phase === 'idle' && (
                  <motion.div
                    key="timeselector"
                    className="absolute left-1/2 top-1/2 w-[min(28rem,90vw)]"
                    style={{ x: '-50%' }}
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: selectorOffsetRef.current }}
                    exit={{ opacity: 0, y: 60 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 200, mass: 0.8 }}
                  >
                    <TimeSelector />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls — pinned at the bottom (shrink-0). TimerControls stays
                mounted across phases so Framer Motion's layout animation can
                smoothly slide Start Focus → Pause into place. */}
            <div className="flex flex-col items-center gap-4 w-full max-w-md shrink-0">
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
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} onNavigateDownload={() => setView('download')} />

      {/* Auto-update notification */}
      <UpdateNotification />
    </div>
  )
}

export default App
