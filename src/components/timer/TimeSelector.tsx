// ──────────────────────────────────────────────
// TimeSelector — Choose focus time (fixed or random)
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Shuffle } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { FixedTimeSlider } from './FixedTimeSlider'
import { useT } from '@/i18n/useT'
import type { SelectionMode } from '@/types'

export function TimeSelector() {
  const { settings, update } = useSettingsStore()
  const { t } = useT()

  const setMode = (mode: SelectionMode) => update({ selectionMode: mode })

  return (
    <div className="w-full max-w-md">
      {/* Mode toggle */}
      <div className="flex gap-2 p-1 rounded-2xl glass mb-6">
        <button
          onClick={() => setMode('fixed')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            settings.selectionMode === 'fixed'
              ? 'bg-focus-500 text-ink-950'
              : 'text-ink-300 hover:text-ink-100'
          }`}
        >
          <Clock size={15} />
          {t('fixedTime')}
        </button>
        <button
          onClick={() => setMode('random')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            settings.selectionMode === 'random'
              ? 'bg-focus-500 text-ink-950'
              : 'text-ink-300 hover:text-ink-100'
          }`}
        >
          <Shuffle size={15} />
          {t('randomTime')}
        </button>
      </div>

      {/* Content area — fixed min-height prevents layout shift */}
      <div className="min-h-[280px] w-full">
        <AnimatePresence mode="wait">
          {settings.selectionMode === 'fixed' ? (
            <motion.div
              key="fixed"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <FixedTimeSlider />
            </motion.div>
          ) : (
            <motion.div
              key="random"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="w-full space-y-5"
            >
              {/* Range display */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-4xl font-light text-focus-300 tabular">
                    {settings.randomMin}
                  </span>
                  <span className="text-ink-500 text-lg">—</span>
                  <span className="text-4xl font-light text-focus-300 tabular">
                    {settings.randomMax}
                  </span>
                  <span className="text-sm text-ink-400 ml-1">{t('min')}</span>
                </div>
                <p className="text-center text-xs text-ink-400 mt-2">
                  {t('randomRangeHint')}
                </p>
              </div>

              {/* Range sliders */}
              <div className="space-y-4">
                <RangeSlider
                  label={t('earliest')}
                  value={settings.randomMin}
                  min={5}
                  max={90}
                  step={5}
                  onChange={(v) => update({ randomMin: Math.min(v, settings.randomMax - 5) })}
                />
                <RangeSlider
                  label={t('latest')}
                  value={settings.randomMax}
                  min={5}
                  max={90}
                  step={5}
                  onChange={(v) => update({ randomMax: Math.max(v, settings.randomMin + 5) })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Reusable range slider ──
function RangeSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  const { t } = useT()
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs text-ink-400">{label}</span>
        <span className="text-xs text-ink-200 tabular">{value} {t('min')}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}
