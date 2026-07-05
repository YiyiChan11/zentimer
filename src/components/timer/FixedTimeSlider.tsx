// ──────────────────────────────────────────────
// FixedTimeSlider — Slider for fixed time selection
// Snap points at 15, 30, 45, 60, 75, 90
// ──────────────────────────────────────────────

import { useMemo, useCallback } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { useT } from '@/i18n/useT'

const SNAP_POINTS = [15, 30, 45, 60, 75, 90]
const ALL_MINUTES = Array.from({ length: 18 }, (_, i) => 5 * (i + 1)) // [5, 10, ..., 90]

/** Find nearest snap point, or null if too far */
function nearestSnap(value: number): number | null {
  let closest = SNAP_POINTS[0]
  let minDist = Math.abs(value - closest)
  for (const p of SNAP_POINTS) {
    const d = Math.abs(value - p)
    if (d < minDist) {
      minDist = d
      closest = p
    }
  }
  return minDist <= 5 ? closest : null
}

export function FixedTimeSlider() {
  const { settings, update } = useSettingsStore()
  const { t } = useT()
  const value = settings.fixedDuration

  const snapActive = useMemo(() => nearestSnap(value), [value])

  const handleChange = useCallback(
    (v: number) => {
      update({ fixedDuration: v })
    },
    [update],
  )

  return (
    <div className="w-full max-w-md space-y-5">
      {/* Main slider */}
      <div className="relative">
        <input
          type="range"
          min={5}
          max={90}
          step={5}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          className="w-full accent-focus-500"
        />
        {/* Snap point markers on the track */}
        <div className="flex justify-between mt-1 px-[2px]">
          {SNAP_POINTS.map((p) => (
            <button
              key={p}
              onClick={() => handleChange(p)}
              className={`text-[10px] tabular transition-colors ${
                snapActive === p
                  ? 'text-focus-300 font-semibold'
                  : 'text-ink-500 hover:text-ink-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Current value display */}
      <div className="text-center">
        <span className="text-5xl font-light tabular text-ink-50">
          {value}
        </span>
        <span className="text-sm text-ink-400 ml-2">{t('min')}</span>
      </div>

      {/* Fine-tune buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => handleChange(Math.max(5, value - 5))}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-ink-300 hover:text-ink-100 transition-all text-lg"
        >
          −
        </button>
        <div className="flex gap-1.5">
          {[15, 25, 30, 45, 60].map((p) => (
            <button
              key={p}
              onClick={() => handleChange(p)}
              className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                value === p
                  ? 'bg-focus-500/20 text-focus-300 ring-1 ring-focus-500/30'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleChange(Math.min(90, value + 5))}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-ink-300 hover:text-ink-100 transition-all text-lg"
        >
          +
        </button>
      </div>
    </div>
  )
}
