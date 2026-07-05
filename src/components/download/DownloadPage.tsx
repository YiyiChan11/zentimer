// ──────────────────────────────────────────────
// DownloadPage — Platform download options
// ──────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Monitor, Smartphone, Globe, ArrowRight, Check } from 'lucide-react'

interface DownloadPageProps {
  onNavigateHome: () => void
}

export function DownloadPage({ onNavigateHome }: DownloadPageProps) {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 noise-overlay">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-focus-400 animate-pulse" />
            <span className="text-xs text-ink-300">多平台可用</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-ink-50 mb-4 tracking-tight">
            随时随地，<span className="text-gradient">保持专注</span>
          </h1>
          <p className="text-ink-400 text-base max-w-lg mx-auto leading-relaxed">
            ZenTimer 支持网页端、Windows 桌面端和 Android 移动端。
            选择适合你的方式开始。
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {/* Web / PWA */}
          <PlatformCard
            delay={0.1}
            icon={<Globe size={22} />}
            badge="推荐"
            badgeColor="focus"
            title="网页版"
            subtitle="PWA · 无需安装"
            features={['打开即用', '可安装到桌面', '自动更新', '跨平台']}
            primaryAction={{
              label: '使用网页版',
              onClick: onNavigateHome,
            }}
          />

          {/* Windows Desktop */}
          <PlatformCard
            delay={0.2}
            icon={<Monitor size={22} />}
            title="Windows 桌面端"
            subtitle="Tauri · 轻量原生"
            features={['悬浮窗置顶', '系统托盘', '离线使用', '极低占用']}
            primaryAction={{
              label: '即将推出',
              onClick: () => {},
            }}
            disabled
          />

          {/* Android */}
          <PlatformCard
            delay={0.3}
            icon={<Smartphone size={22} />}
            title="Android"
            subtitle="APK · 移动原生"
            features={['悬浮通知', '后台计时', '锁屏提醒', '小部件']}
            primaryAction={{
              label: '即将推出',
              onClick: () => {},
            }}
            disabled
          />
        </div>

        {/* PWA install hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-6 mb-12"
        >
          <h3 className="text-sm font-medium text-ink-200 mb-3 flex items-center gap-2">
            <Globe size={15} className="text-focus-400" />
            如何将网页版安装到桌面？
          </h3>
          <ol className="space-y-2 text-sm text-ink-400">
            <li className="flex gap-3">
              <span className="text-focus-400 font-mono text-xs mt-0.5">01</span>
              <span>在 Chrome 或 Edge 浏览器中打开 ZenTimer 网页版</span>
            </li>
            <li className="flex gap-3">
              <span className="text-focus-400 font-mono text-xs mt-0.5">02</span>
              <span>点击地址栏右侧的安装图标（或菜单 → 安装此应用）</span>
            </li>
            <li className="flex gap-3">
              <span className="text-focus-400 font-mono text-xs mt-0.5">03</span>
              <span>确认安装后，即可从桌面直接启动，享受原生应用体验</span>
            </li>
          </ol>
        </motion.div>

        {/* Back to timer */}
        <div className="text-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-focus-300 transition-colors group"
          >
            <ArrowRight size={14} className="rotate-180 group-hover:-translate-x-0.5 transition-transform" />
            返回计时器
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Platform card ──

function PlatformCard({
  icon,
  title,
  subtitle,
  features,
  primaryAction,
  badge,
  badgeColor = 'focus',
  disabled,
  delay,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  features: string[]
  primaryAction: { label: string; onClick: () => void }
  badge?: string
  badgeColor?: 'focus' | 'rest'
  disabled?: boolean
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative glass rounded-2xl p-6 flex flex-col ${
        disabled ? 'opacity-60' : 'hover:bg-white/5 transition-colors'
      }`}
    >
      {badge && (
        <div
          className={`absolute -top-2 right-4 px-2 py-0.5 rounded-full text-[10px] font-medium ${
            badgeColor === 'focus'
              ? 'bg-focus-500 text-ink-950'
              : 'bg-rest-500 text-white'
          }`}
        >
          {badge}
        </div>
      )}

      <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-focus-400 mb-4">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-ink-100">{title}</h3>
      <p className="text-xs text-ink-500 mt-0.5 mb-4">{subtitle}</p>

      <ul className="space-y-2 mb-6 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-ink-300">
            <Check size={13} className="text-focus-400 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <button
        onClick={primaryAction.onClick}
        disabled={disabled}
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
          disabled
            ? 'glass text-ink-500 cursor-not-allowed'
            : 'bg-focus-500 text-ink-950 hover:bg-focus-400'
        }`}
      >
        {primaryAction.label}
      </button>
    </motion.div>
  )
}
