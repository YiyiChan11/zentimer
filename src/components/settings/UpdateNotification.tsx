// ──────────────────────────────────────────────
// UpdateNotification — In-app auto-update UI
// Shows when a new version is available
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, AlertCircle, Sparkles } from 'lucide-react'
import { useUpdaterStore } from '@/store/updaterStore'
import { useT } from '@/i18n/useT'

export function UpdateNotification() {
  const { t } = useT()
  const { status, updateInfo, errorMsg, downloadAndInstall, dismiss } = useUpdaterStore()

  // Only show in Tauri (desktop) environment.
  // Hide during download/installed — SettingsPanel shows its own inline progress.
  if (status === 'idle' || status === 'checking' || status === 'not-available' || status === 'downloading' || status === 'installed') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4"
      >
        <div className="glass-card p-4 flex flex-col gap-3 shadow-xl shadow-ink-950/40">
          <AnimatePresence mode="wait">
            {/* ── Update available ── */}
            {status === 'available' && (
              <motion.div
                key="available"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-focus-400">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-50">
                      {t('updateAvailable')} v{updateInfo?.version}
                    </p>
                    {updateInfo?.body && (
                      <p className="text-xs text-ink-400 mt-1 line-clamp-3 whitespace-pre-wrap">
                        {updateInfo.body}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={dismiss}
                    className="text-ink-500 hover:text-ink-300 transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                <button
                  onClick={downloadAndInstall}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-focus-500 hover:bg-focus-400 text-ink-950 text-sm font-medium transition-colors"
                >
                  <Download size={16} />
                  {t('updateNow')}
                </button>
              </motion.div>
            )}

            {/* ── Error ── */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-400" />
                  <span className="text-sm text-ink-200 flex-1">{t('updateFailed')}</span>
                  <button
                    onClick={dismiss}
                    className="text-ink-500 hover:text-ink-300 transition-colors shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-xs text-ink-500 break-all">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
