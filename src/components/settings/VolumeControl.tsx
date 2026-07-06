// ──────────────────────────────────────────────
// VolumeControl — Volume slider with test button
// ──────────────────────────────────────────────

import { Volume2, Volume1, VolumeX, Volume } from 'lucide-react'

interface VolumeControlProps {
  volume: number
  onChange: (v: number) => void
  onTest: () => void
}

export function VolumeControl({ volume, onChange, onTest }: VolumeControlProps) {
  const getIcon = () => {
    if (volume === 0) return <VolumeX size={18} />
    if (volume < 33) return <Volume1 size={18} />
    if (volume < 80) return <Volume2 size={18} />
    return <Volume size={18} />
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(volume === 0 ? 50 : 0)}
          className="text-ink-300 hover:text-ink-100 transition-colors"
        >
          {getIcon()}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm text-ink-300 tabular w-10 text-right">{volume}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-ink-500">轻</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className={`w-1 rounded-full transition-colors ${
                  n <= Math.ceil(volume / 20)
                    ? 'bg-focus-400'
                    : 'bg-ink-700'
                }`}
                style={{ height: `${4 + n * 2}px` }}
              />
            ))}
          </div>
          <span className="text-[10px] text-ink-500">极响</span>
        </div>
        <button
          onClick={onTest}
          className="text-xs text-focus-400 hover:text-focus-300 transition-colors flex items-center gap-1"
        >
          <Volume2 size={12} />
          试听
        </button>
      </div>

      <p className="text-xs text-ink-500">
        提示：当前默认为中等音量。可调至更高以获得更强提醒效果。
      </p>
    </div>
  )
}
