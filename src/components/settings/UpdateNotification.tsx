// ──────────────────────────────────────────────
// UpdateNotification — In-app auto-update UI
// Shows when a new version is available
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { Download, Check, Loader2, X, AlertCircle, Sparkles } from 'lucide-react'
import { useUpdater } from '@/hooks/useUpdater'
import { useT } from '@/i18n/useT'

export function UpdateNotification() {
  const { t } = useT()
  const { status, updateInfo, downloadProgress, errorMsg, downloadAndInstall, dismiss } = useUpdater()

  // Only show in Tauri (desktop) environment
  if (status === 'idle' || status === 'checking' || status === 'not-available') return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm mx-4"
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

            {/* ── Downloading ── */}
            {status === 'downloading' && (
              <motion.div
                key="downloading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center gap-3">
                  <Loader2 size={18} className="animate-spin text-focus-400" />
                  <span className="text-sm text-ink-200 flex-1">{t('updateDownloading')}</span>
                  <span className="text-sm text-ink-400 tabular-nums">{downloadProgress}%</span>
                </div>
                <div className="h-1.5 bg-ink-100/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-focus-500 rounded-full"
                    animate={{ width: `${downloadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}

            {/* ── Installed / restarting ── */}
            {status === 'installed' && (
              <motion.div
                key="installed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <Check size={18} className="text-focus-400" />
                <span className="text-sm text-ink-200">{t('updateRestarting')}</span>
                <Loader2 size={14} className="animate-spin text-ink-400 ml-auto" />
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
