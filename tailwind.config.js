import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './floating.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f6f4',
          100: '#e8e6e2',
          200: '#c9c5be',
          300: '#a8a29e',
          400: '#7c756d',
          500: '#5c5650',
          600: '#3d3833',
          700: '#2a2622',
          800: '#1a1816',
          900: '#121110',
          950: '#0a0908',
        },
        focus: {
          50: '#fef9ec',
          100: '#fdf0d0',
          200: '#fae09e',
          300: '#f7cd6b',
          400: '#f5b838',
          500: '#e89e0f',
          600: '#c47d09',
          700: '#9c5e0a',
          800: '#7e4a0f',
          900: '#6a3d12',
        },
        rest: {
          50: '#ecfdf9',
          100: '#cffaf0',
          200: '#9ff5e8',
          300: '#5fe8d4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'breathe': 'breathe 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(12px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
