// ──────────────────────────────────────────────
// useFloatingWindow — Floating always-on-top mini timer
// Priority: Tauri native > Document PiP > window.open() popup
// ──────────────────────────────────────────────

import { useState, useCallback, useEffect, useRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useTimerStore } from '@/store/timerStore'
import { formatTime, getProgress } from '@/utils/time'
import { isTauri, showFloatingWindow, hideFloatingWindow, updateFloatingTimer } from '@/utils/tauri'
import type { TimerPhase } from '@/types'

// Check if Document PiP is supported (browser fallback)
function isPiPSupported(): boolean {
  return typeof document !== 'undefined' && 'documentPictureInPicture' in document
}

const PHASE_STYLES: Record<TimerPhase, { color: string; bg: string; label: string }> = {
  idle: { color: '#beb8ad', bg: '#211f1d', label: '准备' },
  focus: { color: '#f9a93c', bg: '#1f1a14', label: '专注中' },
  break: { color: '#63a19d', bg: '#161e1d', label: '休息中' },
  buffer: { color: '#fbc574', bg: '#1f1914', label: '微休息' },
}

// ── Broadcast channel name for popup sync ──
const CHANNEL_NAME = 'zentimer-floating-sync'

/** Content rendered inside the PiP window (browser mode only) */
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
        window.focus()
        if (window.opener) window.opener.focus()
      }}
    >
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
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ transform: 'rotate(-90deg)', zIndex: 1 }}>
        <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
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

/** Generate the HTML for the popup window (window.open fallback) */
function getPopupHTML(): string {
  return `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ZenTimer - 悬浮窗</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{
  width:100%;height:100%;
  overflow:hidden;
  background:transparent;
  font-family:'Inter','Noto Sans SC',-apple-system,sans-serif;
  -webkit-user-select:none;user-select:none;
}
body{
  border-radius:16px;
  background:rgba(18,18,22,0.95);
  backdrop-filter:blur(20px);
  -webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(255,255,255,0.1);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  box-shadow:0 8px 32px rgba(0,0,0,0.5);
}
#time{
  font-size:42px;font-weight:300;color:#f7f6f4;
  letter-spacing:-0.02em;font-variant-numeric:tabular-nums;
  line-height:1;
}
#phase{
  font-size:12px;color:#a8a29e;margin-top:8px;
  letter-spacing:0.15em;text-transform:uppercase;
}
#hint{
  position:absolute;bottom:10px;font-size:9px;
  color:rgba(255,255,255,0.2);letter-spacing:0.1em;
}
</style>
</head>
<body>
<div id="time">00:00</div>
<div id="phase">准备</div>
<div id="hint">双击返回</div>
<script>
const channel = new BroadcastChannel('${CHANNEL_NAME}');
channel.onmessage = (e) => {
  const { time, phase, progress } = e.data;
  document.getElementById('time').textContent = time;
  const labels = { idle:'准备', focus:'专注中', break:'休息中', buffer:'微休息' };
  document.getElementById('phase').textContent = labels[phase] || phase;
  // Update border color based on phase
  const colors = { focus:'rgba(249,169,60,0.35)', break:'rgba(99,161,157,0.35)', buffer:'rgba(251,197,116,0.35)' };
  document.body.style.borderColor = colors[phase] || 'rgba(255,255,255,0.1)';
};
// Double-click to close and focus main window
let clicks = 0;
document.body.onclick = () => {
  clicks++;
  if(clicks===1) setTimeout(()=>{clicks=0},300);
  else{clicks=0;window.opener?.focus();window.close();}
};
</script>
</body>
</html>`
}

export function useFloatingWindow() {
  const [isOpen, setIsOpen] = useState(false)
  const pipWindowRef = useRef<Window | null>(null)
  const rootRef = useRef<Root | null>(null)
  const popupRef = useRef<Window | null>(null)
  const bcRef = useRef<BroadcastChannel | null>(null)
  const { phase, remaining, total } = useTimerStore()

  // Sync timer to Tauri native floating window
  useEffect(() => {
    if (isOpen && isTauri()) {
      const progress = getProgress(remaining, total)
      updateFloatingTimer(formatTime(remaining), phase, progress)
    }
  }, [isOpen, phase, remaining, total])

  // Sync timer to popup via BroadcastChannel
  useEffect(() => {
    if (isOpen && popupRef.current && !bcRef.current) {
      bcRef.current = new BroadcastChannel(CHANNEL_NAME)
    }
    if (isOpen && bcRef.current) {
      const progress = getProgress(remaining, total)
      bcRef.current.postMessage({
        time: formatTime(remaining > 0 ? remaining : 0),
        phase,
        progress,
      })
    }
    return () => {
      if (!isOpen && bcRef.current) {
        bcRef.current.close()
        bcRef.current = null
      }
    }
  }, [isOpen, phase, remaining, total])

  // Watch popup close
  useEffect(() => {
    if (!popupRef.current) return
    const checkClosed = setInterval(() => {
      if (popupRef.current?.closed) {
        popupRef.current = null
        setIsOpen(false)
        if (bcRef.current) {
          bcRef.current.close()
          bcRef.current = null
        }
        clearInterval(checkClosed)
      }
    }, 500)
    return () => clearInterval(checkClosed)
  }, [isOpen])

  const open = useCallback(async () => {
    // ── 1. Tauri native floating window ──
    if (isTauri()) {
      await showFloatingWindow()
      setIsOpen(true)
      return
    }

    // ── 2. Document PiP (Chrome 116+) ──
    if (isPiPSupported()) {
      try {
        const pipWindow = await (document as any).documentPictureInPicture.requestWindow({
          width: 240,
          height: 320,
        })
        pipWindowRef.current = pipWindow

        document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
          pipWindow.document.head.appendChild(node.cloneNode(true))
        })

        const container = pipWindow.document.createElement('div')
        container.id = 'pip-root'
        pipWindow.document.body.appendChild(container)
        pipWindow.document.body.style.margin = '0'
        pipWindow.document.body.style.overflow = 'hidden'

        const root = createRoot(container)
        rootRef.current = root
        root.render(<FloatingContent />)

        pipWindow.addEventListener('pagehide', () => {
          if (rootRef.current) {
            rootRef.current.unmount()
            rootRef.current = null
          }
          pipWindowRef.current = null
          setIsOpen(false)
        })

        setIsOpen(true)
        return
      } catch {
        // PiP failed, fall through to popup
      }
    }

    // ── 3. window.open() popup fallback ──
    const w = 250
    const h = 170
    const left = window.screen.width - w - 40
    const top = window.screen.height - h - 80

    const popup = window.open(
      '',
      'zentimer-floating',
      `width=${w},height=${h},left=${left},top=${top},` +
      `resizable=no,scrollbars=no,status=no,location=no,toolbar=no,menubar=no,` +
      `alwaysOnTop=yes,titlebar=no`
    )

    if (!popup) {
      alert('弹窗被浏览器拦截，请允许本站弹窗后重试')
      return
    }

    popup.document.write(getPopupHTML())
    popup.document.close()
    popupRef.current = popup

    // Send initial data
    const bc = new BroadcastChannel(CHANNEL_NAME)
    bcRef.current = bc
    setTimeout(() => {
      const progress = getProgress(remaining, total)
      bc.postMessage({
        time: formatTime(remaining > 0 ? remaining : 0),
        phase,
        progress,
      })
    }, 200)

    setIsOpen(true)
  }, [phase, remaining, total])

  const close = useCallback(async () => {
    if (isTauri()) {
      await hideFloatingWindow()
      setIsOpen(false)
      return
    }
    if (pipWindowRef.current) {
      pipWindowRef.current.close()
    }
    if (popupRef.current) {
      popupRef.current.close()
      popupRef.current = null
    }
    if (bcRef.current) {
      bcRef.current.close()
      bcRef.current = null
    }
    setIsOpen(false)
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
      if (popupRef.current) {
        popupRef.current.close()
      }
      if (bcRef.current) {
        bcRef.current.close()
      }
    }
  }, [])

  return { isOpen, open, close, supported: true }
}
