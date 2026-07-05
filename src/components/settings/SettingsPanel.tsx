// ──────────────────────────────────────────────
// SettingsPanel — Slide-in settings drawer (i18n ready)
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, Coffee, Zap, RotateCcw, Globe } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { audioEngine } from '@/utils/audio'
import { Toggle } from './Toggle'
import { VolumeControl } from './VolumeControl'
import { useT } from '@/i18n/useT'
import type { Locale } from '@/types'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { settings, update, reset } = useSettingsStore()
  const { t, locale, setLocale } = useT()

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
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink-200">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-7 h-7 rounded-lg glass flex items-center justify-center text-ink-300 hover:text-ink-100 transition-all text-sm"
        >
          −
        </button>
        <div className="w-16 text-center">
          <span className="text-sm text-ink-100 tabular">{value}</span>
          <span className="text-xs text-ink-500 ml-1">{suffix}</span>
        </div>
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
