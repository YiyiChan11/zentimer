// ──────────────────────────────────────────────
// FixedTimeSlider — Slider for fixed time selection
// Visual style matches Random mode (glass card + slider)
// ──────────────────────────────────────────────

import { useCallback } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { useT } from '@/i18n/useT'

const QUICK_POINTS = [15, 25, 30, 45, 60]

export function FixedTimeSlider() {
  const { settings, update } = useSettingsStore()
  const { t } = useT()
  const value = settings.fixedDuration

  const handleChange = useCallback(
    (v: number) => {
      update({ fixedDuration: v })
    },
    [update],
  )

  return (
    <div className="w-full space-y-5">
      {/* Glass card — matches Random's range display */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-baseline justify-center gap-3">
          <span className="text-4xl font-light text-focus-300 tabular">
            {value}
          </span>
          <span className="text-sm text-ink-400">{t('min')}</span>
        </div>
        <p className="text-center text-xs text-ink-400 mt-2">
          {t('fixedTimeHint')}
        </p>
      </div>

      {/* Slider with range labels — matches Random style */}
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs text-ink-400">5 {t('min')}</span>
          <span className="text-xs text-ink-200 tabular">{value} {t('min')}</span>
        </div>
        <input
          type="range"
          min={5}
          max={90}
          step={5}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full accent-focus-500"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-ink-500">5</span>
          <span className="text-xs text-ink-500">90</span>
        </div>
      </div>

      {/* Quick-select chips */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => handleChange(Math.max(5, value - 5))}
          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-ink-400 hover:text-ink-100 transition-all text-sm"
        >
          −
        </button>
        <div className="flex gap-1">
          {QUICK_POINTS.map((p) => (
            <button
              key={p}
              onClick={() => handleChange(p)}
              className={`px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                value === p
                  ? 'bg-focus-500/20 text-focus-300 ring-1 ring-focus-500/30'
                  : 'text-ink-500 hover:text-ink-200 hover:bg-white/5'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleChange(Math.min(90, value + 5))}
          className="w-8 h-8 rounded-lg glass flex items-center justify-center text-ink-400 hover:text-ink-100 transition-all text-sm"
        >
          +
        </button>
      </div>
    </div>
  )
}
