// ──────────────────────────────────────────────
// useFloatingWindow — Document Picture-in-Picture
// Creates a floating always-on-top mini timer window.
// Double-click brings the main app back to focus.
// ──────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useTimerStore } from '@/store/timerStore'
import { formatTime, getProgress } from '@/utils/time'
import type { TimerPhase } from '@/types'

// Check if Document PiP is supported
function isPiPSupported(): boolean {
  return typeof document !== 'undefined' && 'documentPictureInPicture' in document
}

const PHASE_STYLES: Record<TimerPhase, { color: string; bg: string; label: string }> = {
  idle: { color: '#beb8ad', bg: '#211f1d', label: '准备' },
  focus: { color: '#f9a93c', bg: '#1f1a14', label: '专注中' },
  break: { color: '#63a19d', bg: '#161e1d', label: '休息中' },
  buffer: { color: '#fbc574', bg: '#1f1914', label: '微休息' },
}

/** The content rendered inside the PiP window */
function FloatingContent() {
  const { phase, remaining, total } = useTimerStore()
  const style = PHASE_STYLES[phase]
  const progress = getProgress(remaining, total)
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - progress)

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: style.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Inter', 'Noto Sans SC', system-ui, sans-serif",
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
      onDoubleClick={() => {
        // Bring main window to focus
        window.focus()
        if (window.opener) window.opener.focus()
      }}
    >
      {/* Subtle radial glow */}
      <div
        style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: `${style.color}15`,
          filter: 'blur(60px)',
        }}
      />

      {/* Phase label */}
      <div style={{ marginBottom: '16px', textAlign: 'center', zIndex: 1 }}>
        <div
          style={{
            fontSize: '11px',
            color: style.color,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          {style.label}
        </div>
      </div>

      {/* Circular progress */}
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', zIndex: 1 }}>
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="3"
        />
        <circle
          cx="90" cy="90" r={radius}
          fill="none"
          stroke={style.color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke-dashoffset 0.8s linear',
            filter: `drop-shadow(0 0 6px ${style.color}80)`,
          }}
        />
      </svg>

      {/* Time display */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          marginTop: '10px',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: '36px',
            fontWeight: 300,
            color: '#f7f6f4',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
          }}
        >
          {formatTime(remaining > 0 ? remaining : 0)}
        </div>
      </div>

      {/* Footer hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          fontSize: '9px',
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.1em',
        }}
      >
        双击返回主窗口
      </div>
    </div>
  )
}

export function useFloatingWindow() {
  const [isOpen, setIsOpen] = useState(false)
  const pipWindowRef = useRef<Window | null>(null)
  const rootRef = useRef<Root | null>(null)

  const open = useCallback(async () => {
    if (!isPiPSupported()) {
      alert('当前浏览器不支持悬浮窗功能，请使用 Chrome 116+ 或 Edge 116+')
      return
    }

    const pipWindow = await (document as any).documentPictureInPicture.requestWindow({
      width: 240,
      height: 320,
    })

    pipWindowRef.current = pipWindow

    // Copy styles
    document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
      pipWindow.document.head.appendChild(node.cloneNode(true))
    })

    // Create container
    const container = pipWindow.document.createElement('div')
    container.id = 'pip-root'
    pipWindow.document.body.appendChild(container)
    pipWindow.document.body.style.margin = '0'
    pipWindow.document.body.style.overflow = 'hidden'

    // Render React content
    const root = createRoot(container)
    rootRef.current = root
    root.render(<FloatingContent />)

    // Handle window close
    pipWindow.addEventListener('pagehide', () => {
      if (rootRef.current) {
        rootRef.current.unmount()
        rootRef.current = null
      }
      pipWindowRef.current = null
      setIsOpen(false)
    })

    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    if (pipWindowRef.current) {
      pipWindowRef.current.close()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount()
      }
      if (pipWindowRef.current) {
        pipWindowRef.current.close()
      }
    }
  }, [])

  return { isOpen, open, close, supported: isPiPSupported() }
}
