// ── English locale ──

export const en: Record<string, string> = {
  // App
  appTitle: 'ZenTimer — Pomodoro Timer',
  appTagline: 'Focus. Breathe. Continue.',

  // Phases
  phaseReady: 'Ready',
  phaseReadyEn: 'Ready',
  phaseFocus: 'Focusing',
  phaseFocusEn: 'Focus',
  phaseBreak: 'Breaking',
  phaseBreakEn: 'Break',
  phaseBuffer: 'Micro Break',
  phaseBufferEn: 'Buffer',

  // Timer controls
  startFocus: 'Start Focus',
  pause: 'Pause',
  resume: 'Resume',
  reset: 'Reset',
  skipToBreak: 'Skip to Break',
  skipToNext: 'Skip to Next',

  // Time selector
  fixedTime: 'Fixed Time',
  randomTime: 'Random',
  min: 'min',
  randomRangeHint: 'The system will randomly select a duration within this range',

  // Settings
  settings: 'Settings',
  settingsDesc: 'Adjust your focus rhythm',
  breakSettings: 'Break Settings',
  breakDuration: 'Break Duration',
  autoStartBreak: 'Auto-start Break',
  autoStartBreakDesc: 'Automatically enter break after focus ends',
  autoStartFocus: 'Auto-start Focus',
  autoStartFocusDesc: 'Continue with the same settings after break',
  bufferSettings: 'Micro Break',
  bufferEnabled: 'Enable Micro Break',
  bufferEnabledDesc: 'Random 15s break reminder during focus (drink water / rest eyes)',
  bufferTriggerTime: 'Trigger Time',
  bufferTriggerHint: '{min}–{max} min after focus starts',
  bufferDuration: 'Break Duration',
  earliest: 'Earliest',
  latest: 'Latest',
  volumeSettings: 'Volume',
  volumeLight: 'Soft',
  volumeLoud: 'Loud',
  volumeTest: 'Test',
  volumeHint: 'Tip: Default is medium volume. Increase for a stronger alert.',
  resetSettings: 'Reset to Defaults',
  resetConfirm: 'Are you sure you want to reset all settings?',

  // Download page
  downloadTitle: 'Stay Focused, Anywhere',
  downloadSubtitle: 'ZenTimer is available on web, Windows, and Android. Choose what works for you.',
  webVersion: 'Web App',
  webVersionSub: 'PWA · No Install',
  windowsVersion: 'Windows Desktop',
  windowsVersionSub: 'Tauri · Native Lightweight',
  androidVersion: 'Android',
  androidVersionSub: 'APK · Mobile Native',
  featureNoInstall: 'Ready to use',
  featureInstallable: 'Install to desktop',
  featureAutoUpdate: 'Auto-update',
  featureCrossPlatform: 'Cross-platform',
  featureAlwaysOnTop: 'Always-on-top',
  featureSystemTray: 'System tray',
  featureOffline: 'Works offline',
  featureLightweight: 'Tiny footprint',
  featureFloatingNotify: 'Floating notification',
  featureBackground: 'Background timer',
  featureLockScreen: 'Lock screen alert',
  featureWidget: 'Home widget',
  recommended: 'Recommended',
  comingSoon: 'Coming Soon',
  useWebVersion: 'Use Web App',
  backToTimer: 'Back to Timer',

  // PWA install hint
  pwaTitle: 'How to install the web app to your desktop?',
  pwaStep1: 'Open ZenTimer in Chrome or Edge browser',
  pwaStep2: 'Click the install icon in the address bar (or Menu → Install this app)',
  pwaStep3: 'After confirming, you can launch it directly from your desktop',

  // Language
  language: 'Language',
  languageZh: '简体中文',
  languageEn: 'English',

  // Misc
  sessionsToday: 'Today',
  sessionsCount: 'sessions',
  doubleClickReturn: 'Double-click to return',
  floatingWindow: 'Floating Window',
  openFloating: 'Open Floating',
  closeFloating: 'Close Floating',
  keyboardHint: 'Space to start/pause · Esc to reset',
  quote: '"Stillness leads to peace, peace leads to clarity, clarity leads to result."',
  version: 'v1.0 · ZenTimer',
}
