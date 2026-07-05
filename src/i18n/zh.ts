// ── Chinese (Simplified) locale ──

export const zh: Record<string, string> = {
  // App
  appTitle: 'ZenTimer — 禅意番茄钟',
  appTagline: '专注，呼吸，然后继续。',

  // Phases
  phaseReady: '准备',
  phaseReadyEn: 'Ready',
  phaseFocus: '专注中',
  phaseFocusEn: 'Focus',
  phaseBreak: '休息中',
  phaseBreakEn: 'Break',
  phaseBuffer: '微休息',
  phaseBufferEn: 'Micro Break',

  // Timer controls
  startFocus: '开始专注',
  pause: '暂停',
  resume: '继续',
  reset: '重置',
  skipToBreak: '跳过到休息',
  skipToNext: '跳过到下一轮',

  // Time selector
  fixedTime: '固定时间',
  randomTime: '随机时间',
  min: '分钟',
  randomRangeHint: '系统将在此范围内随机选择专注时长',
  fixedTimeHint: '固定专注时长',

  // Settings
  settings: '设置',
  settingsDesc: '调整你的专注节奏',
  breakSettings: '休息设置',
  breakDuration: '休息时长',
  autoStartBreak: '自动开始休息',
  autoStartBreakDesc: '专注结束后自动进入休息',
  autoStartFocus: '休息后自动专注',
  autoStartFocusDesc: '休息结束后使用相同设置继续',
  bufferSettings: '微休息提示',
  bufferEnabled: '启用微休息',
  bufferEnabledDesc: '专注中随机提醒15秒短暂休息（喝水/闭目）',
  bufferTriggerTime: '触发时间',
  bufferTriggerHint: '专注开始后 {min}–{max} 分钟',
  bufferDuration: '微休息时长',
  earliest: '最早',
  latest: '最晚',
  volumeSettings: '音量设置',
  volumeLight: '轻',
  volumeLoud: '极响',
  volumeTest: '试听',
  volumeHint: '提示：当前默认为中等音量。可调至更高以获得更强提醒效果。',
  resetSettings: '重置为默认设置',
  resetConfirm: '确定要重置所有设置吗？',

  // Download page
  multiPlatform: '多平台可用',
  downloadTitle: '随时随地，保持专注',
  downloadSubtitle: 'ZenTimer 支持网页端、Windows 桌面端和 Android 移动端。选择适合你的方式开始。',
  webVersion: '网页版',
  webVersionSub: 'PWA · 无需安装',
  windowsDesktop: 'Windows 桌面端',
  recommended: '推荐',
  comingSoon: '即将推出',
  useWebVersion: '使用网页版',
  download: '下载',
  runningNow: '运行中',
  openInstantly: '打开即用',
  installToDesktop: '可安装到桌面',
  autoUpdate: '自动更新',
  crossPlatform: '跨平台',
  floatingOnTop: '悬浮窗置顶',
  systemTray: '系统托盘',
  offlineUse: '离线使用',
  lowFootprint: '极低占用',
  floatingNotification: '悬浮通知',
  backgroundTimer: '后台计时',
  lockScreenReminder: '锁屏提醒',
  widget: '小部件',
  backToTimer: '返回计时器',

  // PWA install hint
  pwaInstallTitle: '如何将网页版安装到桌面？',
  pwaStep1: '在 Chrome 或 Edge 浏览器中打开 ZenTimer 网页版',
  pwaStep2: '点击地址栏右侧的安装图标（或菜单 → 安装此应用）',
  pwaStep3: '确认安装后，即可从桌面直接启动，享受原生应用体验',

  // PWA install hint
  pwaTitle: '如何将网页版安装到桌面？',
  pwaStep1: '在 Chrome 或 Edge 浏览器中打开 ZenTimer 网页版',
  pwaStep2: '点击地址栏右侧的安装图标（或菜单 → 安装此应用）',
  pwaStep3: '确认安装后，即可从桌面直接启动，享受原生应用体验',

  // Language
  language: '语言',
  languageZh: '简体中文',
  languageEn: 'English',

  // Misc
  sessionsToday: '今日',
  sessionsCount: '轮',
  doubleClickReturn: '双击返回主窗口',
  floatingWindow: '悬浮窗',
  openFloating: '开启悬浮窗',
  closeFloating: '关闭悬浮窗',
  keyboardHint: '空格 开始/暂停 · Esc 重置',
  quote: '「静而后能安，安而后能虑，虑而后能得。」',
  version: 'v1.0 · 禅意番茄钟',
}
