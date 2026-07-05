// ──────────────────────────────────────────────
// TimeSelector — Choose focus time (fixed or random)
// ──────────────────────────────────────────────

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Shuffle } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import type { SelectionMode } from '@/types'

const FIXED_TIMES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90]

export function TimeSelector() {
  const { settings, update } = useSettingsStore()
  const [editingRange, setEditingRange] = useState(false)

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
          固定时间
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
          随机时间
        </button>
      </div>

      <AnimatePresence mode="wait">
        {settings.selectionMode === 'fixed' ? (
          <motion.div
            key="fixed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {/* Fixed time grid */}
            <div className="grid grid-cols-6 gap-2">
              {FIXED_TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => update({ fixedDuration: t })}
                  className={`relative py-3 rounded-xl text-sm font-medium transition-all ${
                    settings.fixedDuration === t
                      ? 'bg-focus-500/15 text-focus-300 ring-1 ring-focus-500/30'
                      : 'glass text-ink-300 hover:text-ink-100 hover:bg-white/5'
                  }`}
                >
                  {t}
                  <span className="block text-[10px] text-ink-500 mt-0.5">min</span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="random"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
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
                <span className="text-sm text-ink-400 ml-1">分钟</span>
              </div>
              <p className="text-center text-xs text-ink-400 mt-2">
                系统将在此范围内随机选择专注时长
              </p>
            </div>

            {/* Range sliders */}
            <div className="space-y-4">
              <RangeSlider
                label="最小值"
                value={settings.randomMin}
                min={5}
                max={90}
                step={5}
                onChange={(v) => update({ randomMin: Math.min(v, settings.randomMax - 5) })}
              />
              <RangeSlider
                label="最大值"
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
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-xs text-ink-400">{label}</span>
        <span className="text-xs text-ink-200 tabular">{value} min</span>
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
