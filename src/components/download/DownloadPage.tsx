// ──────────────────────────────────────────────
// DownloadPage — Platform download options
// ──────────────────────────────────────────────

import { motion } from 'framer-motion'
import { Monitor, Smartphone, Globe, ArrowRight, Check, Download } from 'lucide-react'
import { useT } from '@/i18n/useT'
import { isTauri } from '@/utils/tauri'

interface DownloadPageProps {
  onNavigateHome: () => void
}

export function DownloadPage({ onNavigateHome }: DownloadPageProps) {
  const { t } = useT()
  const runningInTauri = isTauri()

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
            <span className="text-xs text-ink-300">{t('multiPlatform')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-light text-ink-50 mb-4 tracking-tight">
            {t('downloadTitle')}
          </h1>
          <p className="text-ink-400 text-base max-w-lg mx-auto leading-relaxed">
            {t('downloadSubtitle')}
          </p>
        </motion.div>

        {/* Platform cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-12">
          {/* Web / PWA */}
          <PlatformCard
            delay={0.1}
            icon={<Globe size={22} />}
            badge={t('recommended')}
            badgeColor="focus"
            title={t('webVersion')}
            subtitle="PWA · No install"
            features={[t('openInstantly'), t('installToDesktop'), t('autoUpdate'), t('crossPlatform')]}
            primaryAction={{
              label: t('useWebVersion'),
              onClick: onNavigateHome,
            }}
          />

          {/* Windows Desktop */}
          <PlatformCard
            delay={0.2}
            icon={<Monitor size={22} />}
            badge={runningInTauri ? t('runningNow') : 'NEW'}
            badgeColor={runningInTauri ? 'rest' : 'focus'}
            title={t('windowsDesktop')}
            subtitle="Tauri · Native"
            features={[t('floatingOnTop'), t('systemTray'), t('offlineUse'), t('lowFootprint')]}
            primaryAction={{
              label: runningInTauri ? t('runningNow') : t('download'),
              onClick: () => {
                if (runningInTauri) {
                  onNavigateHome()
                } else {
                  window.open('https://github.com/YiyiChan11/zentimer/releases', '_blank')
                }
              },
            }}
            disabled={false}
          />

          {/* Android */}
          <PlatformCard
            delay={0.3}
            icon={<Smartphone size={22} />}
            title="Android"
            subtitle="APK · Mobile"
            features={[t('floatingNotification'), t('backgroundTimer'), t('lockScreenReminder'), t('widget')]}
            primaryAction={{
              label: t('comingSoon'),
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
            {t('pwaInstallTitle')}
          </h3>
          <ol className="space-y-2 text-sm text-ink-400">
            <li className="flex gap-3">
              <span className="text-focus-400 font-mono text-xs mt-0.5">01</span>
              <span>{t('pwaStep1')}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-focus-400 font-mono text-xs mt-0.5">02</span>
              <span>{t('pwaStep2')}</span>
            </li>
            <li className="flex gap-3">
              <span className="text-focus-400 font-mono text-xs mt-0.5">03</span>
              <span>{t('pwaStep3')}</span>
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
            {t('backToTimer')}
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
        className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
          disabled
            ? 'glass text-ink-500 cursor-not-allowed'
            : 'bg-focus-500 text-ink-950 hover:bg-focus-400'
        }`}
      >
        {!disabled && <Download size={14} />}
        {primaryAction.label}
      </button>
    </motion.div>
  )
}
