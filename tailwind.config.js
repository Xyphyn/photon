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
    },
    extend: {
      animation: {
        'pop-in': 'pop-in 0.25s ease-out forwards',
      },
      spacing: {
        '22': '88px'
      },
      keyframes: {
        'pop-in': {
          '0%, 100%': { transform: 'translateX(8px)', opacity: 0 },
        },
      },
      colors: {
        slate: {
          25: 'var(--c-s-25,rgb(252,253,254))',
          50: `var(--c-s-50,${colors.slate[50]})`,
          100: `var(--c-s-100,${colors.slate[100]})`,
          200: `var(--c-s-200,#e8edf4)`,
          300: `var(--c-s-300,${colors.slate[300]})`,
          400: `var(--c-s-400,${colors.slate[400]})`,
          500: `var(--c-s-500,${colors.slate[500]})`,
          600: `var(--c-s-600,${colors.slate[600]})`,
          700: `var(--c-s-700,${colors.slate[700]})`,
          800: `var(--c-s-800,${colors.slate[800]})`,
          900: `var(--c-s-900,${colors.slate[900]})`,
          950: `var(--c-s-950,${colors.slate[950]})`,
        },
        zinc: {
          50: `var(--c-z-50,${colors.zinc[50]})`,
          100: `var(--c-z-100,${colors.zinc[100]})`,
          200: `var(--c-z-200,${colors.zinc[200]})`,
          300: `var(--c-z-300,${colors.zinc[300]})`,
          400: `var(--c-z-400,${colors.zinc[400]})`,
          500: `var(--c-z-500,${colors.zinc[500]})`,
          600: `var(--c-z-600,${colors.zinc[600]})`,
          700: 'var(--c-z-700,#34343b)',
          800: 'var(--c-z-800,#1f1f24)',
          900: 'var(--c-z-900,#121215)',
          925: 'var(--c-z-925,#0c0c0e)',
          950: `var(--c-z-950,${colors.zinc[950]})`,
        },
        primary: {
          100: 'var(--c-p-100,#f1f5f9)',
          900: 'var(--c-p-900,#0f172a)',
        },
        black: `#000`,
        white: `var(--c-o-white,#fff)`
      },
    },
  },
  plugins: [],
}
