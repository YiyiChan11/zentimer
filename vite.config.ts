import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// PWA only for web builds — Tauri desktop app must NOT register a Service Worker,
// because the SW caches old assets and prevents updates from taking effect.
const isTauri = !!process.env.TAURI_ENV_PLATFORM

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    !isTauri && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'ZenTimer — 禅意番茄钟',
        short_name: 'ZenTimer',
        description: '专注，呼吸，然后继续。一款禅意番茄钟计时器。',
        theme_color: '#211f1d',
        background_color: '#211f1d',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5180,
    strictPort: !!process.env.TAURI_ENV_PLATFORM,
  },
  // Tauri build target
  build: {
    target: process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'esnext',
  },
})
