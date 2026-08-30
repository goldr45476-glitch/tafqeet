/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"Cairo"', 'system-ui', 'sans-serif'],
        arabic: ['"Cairo"', '"Tajawal"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#e0eafe',
          200: '#c7d9fe',
          300: '#a4befc',
          400: '#7a98f8',
          500: '#5570f1',
          600: '#3c4de4',
          700: '#333cc9',
          800: '#2f35a2',
          900: '#2c3280',
          950: '#1c1e4d',
        },
        accent: {
          50: '#eefcf6',
          100: '#d5f7e8',
          200: '#adeed3',
          300: '#78dfb9',
          400: '#40c99b',
          500: '#1ead81',
          600: '#128b69',
          700: '#116f57',
          800: '#125847',
          900: '#11493c',
          950: '#062a22',
        },
        surface: {
          light: '#f7f8fc',
          dark: '#0a0c1b',
        },
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(16, 24, 60, 0.08), 0 8px 24px -8px rgba(16, 24, 60, 0.12)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 20px 60px -20px rgba(85, 112, 241, 0.45)',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(120,140,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,140,255,0.08) 1px, transparent 1px)',
        'dot-pattern': 'radial-gradient(circle, rgba(120,140,255,0.35) 1px, transparent 1.5px)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-18px) translateX(10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-30px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.9' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(-8px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(-26px)' },
        },
        driftReverse: {
          '0%, 100%': { transform: 'translateX(0px)' },
          '50%': { transform: 'translateX(26px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        bgSwitchIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        floatSlow: 'floatSlow 14s ease-in-out infinite',
        pulseSoft: 'pulseSoft 5s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease both',
        shimmer: 'shimmer 3s linear infinite',
        toastIn: 'toastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        drift: 'drift 16s ease-in-out infinite',
        driftReverse: 'driftReverse 19s ease-in-out infinite',
        spinSlow: 'spinSlow 42s linear infinite',
        bgSwitchIn: 'bgSwitchIn 0.5s ease both',
      },
    },
  },
  plugins: [],
};
