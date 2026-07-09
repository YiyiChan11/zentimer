// ──────────────────────────────────────────────
// SettingsPanel — Slide-in settings drawer (i18n ready)
// ──────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, Coffee, Zap, RotateCcw, Globe, PictureInPicture2, RefreshCw, Sparkles, Download, Loader2, Check, AlertCircle } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { audioEngine } from '@/utils/audio'
import { Toggle } from './Toggle'
import { VolumeControl } from './VolumeControl'
import { useT } from '@/i18n/useT'
import { useFloatingWindow } from '@/hooks/useFloatingWindow'
import { useUpdaterStore } from '@/store/updaterStore'
import type { Locale } from '@/types'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { settings, update, reset } = useSettingsStore()
  const { t, locale, setLocale } = useT()
  const floatingWindow = useFloatingWindow()
  const updater = useUpdaterStore()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass-strong overflow-y-auto no-scrollbar"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass-strong px-6 py-5 flex items-center justify-between border-b border-white/5">
              <div>
                <h2 className="text-lg font-semibold text-ink-50">{t('settings')}</h2>
                <p className="text-xs text-ink-400 mt-0.5">{t('settingsDesc')}</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* ── Language ── */}
              <section>
                <SectionTitle icon={<Globe size={15} />} title={t('language')} />
                <div className="mt-4 flex gap-2">
                  {([
                    { code: 'zh' as Locale, label: t('languageZh') },
                    { code: 'en' as Locale, label: t('languageEn') },
                  ]).map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => setLocale(code)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        locale === code
                          ? 'bg-focus-500 text-ink-950'
                          : 'glass text-ink-300 hover:text-ink-100'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Break settings ── */}
              <section>
                <SectionTitle icon={<Coffee size={15} />} title={t('breakSettings')} />
                <div className="space-y-4 mt-4">
                  <NumberRow
                    label={t('breakDuration')}
                    value={settings.breakDuration}
                    suffix={t('min')}
                    min={1}
                    max={30}
                    onChange={(v) => update({ breakDuration: v })}
                  />
                  <ToggleRow
                    label={t('autoStartBreak')}
                    description={t('autoStartBreakDesc')}
                    checked={settings.autoStartBreak}
                    onChange={(v) => update({ autoStartBreak: v })}
                  />
                  <ToggleRow
                    label={t('autoStartFocus')}
                    description={t('autoStartFocusDesc')}
                    checked={settings.autoStartFocus}
                    onChange={(v) => update({ autoStartFocus: v })}
                  />
                </div>
              </section>

              {/* ── Buffer break settings ── */}
              <section>
                <SectionTitle icon={<Zap size={15} />} title={t('bufferSettings')} />
                <div className="space-y-4 mt-4">
                  <ToggleRow
                    label={t('bufferEnabled')}
                    description={t('bufferEnabledDesc')}
                    checked={settings.bufferEnabled}
                    onChange={(v) => update({ bufferEnabled: v })}
                  />
                  {settings.bufferEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pl-1"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-ink-300">{t('bufferTriggerTime')}</span>
                        <span className="text-ink-400 text-xs">
                          {t('bufferTriggerHint', { min: String(settings.bufferMinMinute), max: String(settings.bufferMaxMinute) })}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <NumberRow
                          label={t('earliest')}
                          value={settings.bufferMinMinute}
                          suffix={t('min')}
                          min={1}
                          max={15}
                          onChange={(v) =>
                            update({
                              bufferMinMinute: Math.min(v, settings.bufferMaxMinute - 1),
                            })
                          }
                        />
                        <NumberRow
                          label={t('latest')}
                          value={settings.bufferMaxMinute}
                          suffix={t('min')}
                          min={3}
                          max={30}
                          onChange={(v) =>
                            update({
                              bufferMaxMinute: Math.max(v, settings.bufferMinMinute + 1),
                            })
                          }
                        />
                      </div>
                      <NumberRow
                        label={t('bufferDuration')}
                        value={settings.bufferSeconds}
                        suffix="秒"
                        min={5}
                        max={60}
                        onChange={(v) => update({ bufferSeconds: v })}
                      />
                    </motion.div>
                  )}
                </div>
              </section>

              {/* ── Volume settings ── */}
              <section>
                <SectionTitle icon={<Volume2 size={15} />} title={t('volumeSettings')} />
                <div className="mt-4">
                  <VolumeControl
                    volume={settings.volume}
                    onChange={(v) => update({ volume: v })}
                    onTest={() => audioEngine.testVolume()}
                  />
                </div>
              </section>

              {/* ── Floating window ── */}
              <section>
                <SectionTitle icon={<PictureInPicture2 size={15} />} title={t('floatingWindow')} />
                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => (floatingWindow.isOpen ? floatingWindow.close() : floatingWindow.open())}
                    className={`w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                      floatingWindow.isOpen
                        ? 'bg-focus-500 text-white shadow-lg shadow-focus-500/30'
                        : 'glass text-ink-300 hover:text-ink-100'
                    }`}
                  >
                    <PictureInPicture2 size={16} />
                    {floatingWindow.isOpen ? t('floatingClose') : t('floatingOpen')}
                  </button>
                  <p className="text-xs text-ink-500">{t('floatingHint')}</p>
                </div>
              </section>

              {/* ── Update ── */}
              <section>
                <SectionTitle icon={<RefreshCw size={15} />} title={t('update')} />
                <div className="mt-4 space-y-3">
                  {/* Current version + Check button */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-300">{t('currentVersion')}</span>
                    <span className="text-ink-400 text-xs tabular">v{updater.currentVersion || '—'}</span>
                  </div>
                  <button
                    onClick={() => updater.checkForUpdates()}
                    disabled={updater.status === 'checking' || updater.status === 'downloading'}
                    className="w-full py-2.5 rounded-xl text-sm font-medium transition-all glass text-ink-300 hover:text-ink-100 hover:bg-white/5 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {updater.status === 'checking' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {t('updateChecking')}
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        {t('checkUpdate')}
                      </>
                    )}
                  </button>

                  {/* ═══ Full update status card (below check button) ═══ */}
                  <AnimatePresence mode="wait">
                    {updater.status === 'available' && updater.updateInfo && (
                      <motion.div
                        key="available"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-focus-500/20 bg-focus-500/5 p-4 space-y-3">
                          {/* Header row */}
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 text-focus-400 shrink-0">
                              <Sparkles size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-ink-50">
                                {t('updateAvailable')} v{updater.updateInfo.version}
                              </p>
                              <p className="text-xs text-ink-400 mt-0.5">
                                {t('updateAvailableDesc')}
                              </p>
                            </div>
                          </div>

                          {/* Changelog body */}
                          {updater.updateInfo.body && (
                            <div className="bg-black/20 rounded-xl p-3">
                              <p className="text-[11px] font-medium text-focus-400/80 uppercase tracking-wider mb-1.5">
                                {t('updateChangelog')}
                              </p>
                              <pre className="text-xs text-ink-300 whitespace-pre-wrap font-sans leading-relaxed max-h-32 overflow-y-auto no-scrollbar">
                                {updater.updateInfo.body}
                              </pre>
                            </div>
                          )}

                          {/* Update button */}
                          <button
                            onClick={() => updater.downloadAndInstall()}
                            className="w-full py-2.5 rounded-xl text-sm font-semibold bg-focus-500 hover:bg-focus-400 text-white shadow-lg shadow-focus-500/25 transition-all flex items-center justify-center gap-2"
                          >
                            <Download size={16} />
                            {t('updateNow')} v{updater.updateInfo.version}
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {updater.status === 'downloading' && (
                      <motion.div
                        key="downloading"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 space-y-3">
                          <div className="flex items-center gap-3">
                            <Loader2 size={18} className="animate-spin text-focus-400" />
                            <span className="text-sm text-ink-200 flex-1">{t('updateDownloading')}</span>
                            <span className="text-sm text-ink-400 tabular-nums font-medium">{updater.downloadProgress}%</span>
                          </div>
                          <div className="h-2 bg-ink-100/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-gradient-to-r from-focus-600 to-focus-400"
                              animate={{ width: `${updater.downloadProgress}%` }}
                              transition={{ duration: 0.35, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {updater.status === 'installed' && (
                      <motion.div
                        key="installed"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-green-500/15 bg-green-500/5 p-4 flex flex-col items-center gap-2 text-center">
                          <Check size={24} className="text-green-400" />
                          <span className="text-sm text-ink-200 font-medium">{t('updateRestarting')}</span>
                          <span className="text-xs text-ink-500">{t('updateRestartHint')}</span>
                          <Loader2 size={14} className="animate-spin text-green-400/60 mt-1" />
                        </div>
                      </motion.div>
                    )}

                    {updater.status === 'not-available' && (
                      <motion.p
                        key="uptodate"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-emerald-400/70 text-center py-1.5"
                      >
                        {t('updateUpToDate')}
                      </motion.p>
                    )}

                    {updater.status === 'error' && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, height: 0, y: -8 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-4 space-y-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                            <span className="text-sm text-red-300">{t('updateFailed')}</span>
                          </div>
                          <p className="text-xs text-red-400/60 break-all leading-relaxed">{updater.errorMsg}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>

              {/* ── Reset ── */}
              <section className="pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    if (confirm(t('resetConfirm'))) {
                      reset()
                    }
                  }}
                  className="flex items-center gap-2 text-sm text-ink-400 hover:text-red-400 transition-colors"
                >
                  <RotateCcw size={14} />
                  {t('resetSettings')}
                </button>
              </section>

              {/* ── About ── */}
              <section className="pb-4">
                <p className="text-center text-xs text-ink-600">
                  {t('version')}
                </p>
              </section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Sub-components ──

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-focus-400">{icon}</span>
      <h3 className="text-sm font-medium text-ink-200">{title}</h3>
    </div>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm text-ink-200">{label}</p>
        {description && <p className="text-xs text-ink-500 mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

function NumberRow({
  label,
  value,
  suffix,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  suffix: string
  min: number
  max: number
  onChange: (v: number) => void
}) {
  const [text, setText] = useState(String(value))

  // Keep the input in sync when value changes externally (e.g. +/- buttons)
  useEffect(() => {
    setText(String(value))
  }, [value])

  const commit = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (digits === '') {
      setText(String(value))
      return
    }
    let n = parseInt(digits, 10)
    if (isNaN(n)) n = min
    n = Math.min(max, Math.max(min, n))
    onChange(n)
    setText(String(n))
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-ink-200">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 rounded-lg glass flex items-center justify-center text-ink-300 hover:text-ink-100 transition-all text-sm"
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={text}
          onChange={(e) => setText(e.target.value.replace(/\D/g, ''))}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
          }}
          className="w-14 text-center bg-transparent text-sm text-ink-100 tabular border border-white/10 rounded-md py-1 focus:outline-none focus:border-focus-400"
        />
        <span className="text-xs text-ink-500">{suffix}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="w-7 h-7 rounded-lg glass flex items-center justify-center text-ink-300 hover:text-ink-100 transition-all text-sm"
        >
          +
        </button>
      </div>
    </div>
  )
}
