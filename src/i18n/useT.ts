// ──────────────────────────────────────────────
// i18n — useT hook
// Reads locale from settings store, returns t() function.
// Usage: const { t, locale, setLocale } = useT()
// ──────────────────────────────────────────────

import { useCallback } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { zh } from './zh'
import { en } from './en'
import type { Locale } from '@/types'

const dicts = { zh, en } as Record<Locale, Record<string, string>>

export function useT() {
  const locale = useSettingsStore((s) => (s.settings as any).locale ?? 'zh') as Locale

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const d = dicts[locale] ?? dicts.zh
      let str = d[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          str = str.replace(`{${k}}`, String(v))
        }
      }
      return str
    },
    [locale],
  )

  const setLocale = useCallback(
    (l: Locale) => {
      useSettingsStore.getState().update({ locale: l } as any)
    },
    [],
  )

  return { t, locale, setLocale }
}
