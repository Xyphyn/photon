import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'src/**/*.{js,ts,svelte,html}',
    'node_modules/mono-svelte/**/*.{js,ts,svelte,html}',
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['sans-serif'],
      system: ['system-ui'],
      serif: ['serif'],
      inter: ['Inter', 'system-ui', 'sans-serif'],
      nunito: ['Nunito', 'system-ui', 'sans-serif'],
      display: ['Satoshi', 'system-ui', 'sans-serif'],
    },
    extend: {
      animation: {
        'pop-in': 'pop-in 0.25s ease-out forwards',
      },
      spacing: {
        22: '88px',
      },
      keyframes: {
        'pop-in': {
          '0%, 100%': { transform: 'translateX(8px)', opacity: 0 },
        },
      },
      colors: {
        slate: {
          25: 'rgb(var(--c-s-25,252 253 254) / <alpha-value>)',
          50: 'rgb(var(--c-s-50,248 250 252) / <alpha-value>)',
          100: 'rgb(var(--c-s-100,241 245 249) / <alpha-value>)',
          200: 'rgb(var(--c-s-200,226 232 240) / <alpha-value>)',
          300: 'rgb(var(--c-s-300,203 213 225) / <alpha-value>)',
          400: 'rgb(var(--c-s-400,148 163 184) / <alpha-value>)',
          500: 'rgb(var(--c-s-500,100 116 139) / <alpha-value>)',
          600: 'rgb(var(--c-s-600,71 85 105) / <alpha-value>)',
          700: 'rgb(var(--c-s-700,51 65 85) / <alpha-value>)',
          800: 'rgb(var(--c-s-800,30 41 59) / <alpha-value>)',
          900: 'rgb(var(--c-s-900,15 23 42) / <alpha-value>)',
          950: 'rgb(var(--c-s-950,2 6 23) / <alpha-value>)',
        },
        zinc: {
          50: `rgb(var(--c-z-50,249 250 251) / <alpha-value>)`,
          100: `rgb(var(--c-z-100,243 244 246) / <alpha-value>)`,
          200: `rgb(var(--c-z-200,229 231 235) / <alpha-value>)`,
          300: `rgb(var(--c-z-300,209 213 219) / <alpha-value>)`,
          400: `rgb(var(--c-z-400,156 163 175) / <alpha-value>)`,
          500: `rgb(var(--c-z-500,107 114 128) / <alpha-value>)`,
          600: `rgb(var(--c-z-600,75 85 99) / <alpha-value>)`,
          700: 'rgb(var(--c-z-700,50 60 76) / <alpha-value>)',
          800: 'rgb(var(--c-z-800,22 31 45) / <alpha-value>)',
          900: 'rgb(var(--c-z-900,17 24 39) / <alpha-value>)',
          925: 'rgb(var(--c-z-925,8 12 25) / <alpha-value>)',
          950: `rgb(var(--c-z-950,5 9 16) / <alpha-value>)`,
        },
        primary: {
          100: 'rgb(var(--c-p-100,241 245 249) / <alpha-value>)',
          900: 'rgb(var(--c-p-900,15 23 42) / <alpha-value>)',
        },
        black: `rgb(var(--c-o-black,0 0 0) / <alpha-value>)`,
        white: `rgb(var(--c-o-white,255 255 255) / <alpha-value>)`,
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
}
