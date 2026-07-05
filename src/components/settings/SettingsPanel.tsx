// ──────────────────────────────────────────────
// SettingsPanel — Slide-in settings drawer
// ──────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion'
import { X, Volume2, Coffee, Zap, RotateCcw } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'
import { audioEngine } from '@/utils/audio'
import { Toggle } from './Toggle'
import { VolumeControl } from './VolumeControl'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { settings, update, reset } = useSettingsStore()

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
                <h2 className="text-lg font-semibold text-ink-50">设置</h2>
                <p className="text-xs text-ink-400 mt-0.5">调整你的专注节奏</p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center text-ink-300 hover:text-ink-100 hover:bg-white/5 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* ── Break settings ── */}
              <section>
                <SectionTitle icon={<Coffee size={15} />} title="休息设置" />
                <div className="space-y-4 mt-4">
                  <NumberRow
                    label="休息时长"
                    value={settings.breakDuration}
                    suffix="分钟"
                    min={1}
                    max={30}
                    onChange={(v) => update({ breakDuration: v })}
                  />
                  <ToggleRow
                    label="自动开始休息"
                    description="专注结束后自动进入休息"
                    checked={settings.autoStartBreak}
                    onChange={(v) => update({ autoStartBreak: v })}
                  />
                  <ToggleRow
                    label="休息后自动专注"
                    description="休息结束后使用相同设置继续"
                    checked={settings.autoStartFocus}
                    onChange={(v) => update({ autoStartFocus: v })}
                  />
                </div>
              </section>

              {/* ── Buffer break settings ── */}
              <section>
                <SectionTitle icon={<Zap size={15} />} title="微休息提示" />
                <div className="space-y-4 mt-4">
                  <ToggleRow
                    label="启用微休息"
                    description="专注中随机提醒15秒短暂休息（喝水/闭目）"
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
                        <span className="text-ink-300">触发时间</span>
                        <span className="text-ink-400 text-xs">
                          专注开始后 {settings.bufferMinMinute}–{settings.bufferMaxMinute} 分钟
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <NumberRow
                          label="最早"
                          value={settings.bufferMinMinute}
                          suffix="分钟"
                          min={1}
                          max={15}
                          onChange={(v) =>
                            update({
                              bufferMinMinute: Math.min(v, settings.bufferMaxMinute - 1),
                            })
                          }
                        />
                        <NumberRow
                          label="最晚"
                          value={settings.bufferMaxMinute}
                          suffix="分钟"
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
                        label="微休息时长"
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
                <SectionTitle icon={<Volume2 size={15} />} title="音量设置" />
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
                    if (confirm('确定要重置所有设置吗？')) {
                      reset()
                    }
                  }}
                  className="flex items-center gap-2 text-sm text-ink-400 hover:text-red-400 transition-colors"
                >
                  <RotateCcw size={14} />
                  重置为默认设置
                </button>
              </section>

              {/* ── About ── */}
              <section className="pb-4">
                <p className="text-center text-xs text-ink-600">
                  ZenTimer v1.0 · 禅意番茄钟
                  <br />
                  <span className="text-ink-700">专注，呼吸，然后继续。</span>
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
