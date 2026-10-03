/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Lora"', '"Noto Naskh Arabic"', '"Traditional Arabic"', 'Georgia', 'serif'],
        arabic: ['"Noto Naskh Arabic"', '"Amiri"', '"Traditional Arabic"', '"Times New Roman"', 'serif'],
        display: ['"Amiri"', '"Cormorant Garamond"', '"Traditional Arabic"', 'Georgia', 'serif'],
      },
      colors: {
        // Warm "parchment" neutrals replace the cold blue-grey slate so every
        // existing text-slate-* / border-slate-* class turns warm automatically.
        slate: {
          50: '#fbf7ed',
          100: '#f4ecda',
          200: '#e7dcc2',
          300: '#d2c3a1',
          400: '#a99b7b',
          500: '#7e725a',
          600: '#615640',
          700: '#4a4131',
          800: '#352e23',
          900: '#241f17',
          950: '#171310',
        },
        // Primary: deep emerald ("zumurrud")
        brand: {
          50: '#eaf5f0',
          100: '#d0e8de',
          200: '#a5d1c0',
          300: '#72b6a0',
          400: '#3f977f',
          500: '#237d66',
          600: '#176652',
          700: '#12503f',
          800: '#0f4236',
          900: '#0c352c',
          950: '#06201a',
        },
        // Secondary: antique gold
        accent: {
          50: '#fbf6e5',
          100: '#f5ebcc',
          200: '#ecd69b',
          300: '#e0bb66',
          400: '#d0a040',
          500: '#b98530',
          600: '#9a6b25',
          700: '#7b5420',
          800: '#63431f',
          900: '#52371e',
          950: '#2f1e0e',
        },
        // Tool colours: sapphire, burgundy
        sapphire: {
          50: '#edf3f8',
          100: '#d6e3ef',
          200: '#aec8de',
          300: '#7fa6c8',
          400: '#5183ae',
          500: '#356a97',
          600: '#2a5780',
          700: '#224767',
          800: '#1d3a53',
          900: '#182f44',
        },
        ruby: {
          50: '#faeff0',
          100: '#f4dadd',
          200: '#e8b6bc',
          300: '#d98a96',
          400: '#c35f72',
          500: '#a73f56',
          600: '#8c2f45',
          700: '#722639',
          800: '#5d2130',
          900: '#4c1d2a',
        },
        surface: {
          light: '#f6efdf',
          dark: '#16120e',
          card: '#fffcf4',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(74, 52, 20, 0.08), 0 6px 18px -8px rgba(74, 52, 20, 0.22)',
        glow: '0 1px 0 rgba(255,255,255,0.35) inset, 0 8px 20px -10px rgba(18, 82, 67, 0.55)',
      },
      backgroundImage: {},
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
      },
      animation: {
        float: 'float 9s ease-in-out infinite',
        floatSlow: 'floatSlow 14s ease-in-out infinite',
        pulseSoft: 'pulseSoft 5s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease both',
        shimmer: 'shimmer 3s linear infinite',
        toastIn: 'toastIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
