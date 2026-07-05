/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif SC"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        // Focus mode — warm amber tones
        focus: {
          50: '#fef9f0',
          100: '#fef0d9',
          200: '#fddeae',
          300: '#fbc574',
          400: '#f9a93c',
          500: '#f78d14',
          600: '#e3700b',
          700: '#bd530c',
          800: '#984112',
          900: '#7b3611',
          950: '#441a06',
        },
        // Break mode — cool sage/teal tones
        rest: {
          50: '#f1f8f7',
          100: '#ddeeed',
          200: '#bfdcd9',
          300: '#93c2bf',
          400: '#63a19d',
          500: '#47857f',
          600: '#396b67',
          700: '#305653',
          800: '#2a4744',
          900: '#263d3a',
          950: '#112220',
        },
        // Neutral palette — warm dark
        ink: {
          50: '#f7f6f4',
          100: '#eeece8',
          200: '#dad6cf',
          300: '#beb8ad',
          400: '#9d968a',
          500: '#827b70',
          600: '#6b655c',
          700: '#57524b',
          800: '#48443f',
          900: '#3d3a36',
          950: '#211f1d',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'breath': 'breath 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        breath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.03)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.2' },
          '100%': { transform: 'scale(0.95)', opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
