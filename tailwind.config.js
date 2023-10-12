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
      keyframes: {
        'pop-in': {
          '0%, 100%': { transform: 'translateX(8px)', opacity: 0 },
        },
      },
      colors: {
        white: 'var(--white,#fff)',
        black: 'var(--black,#000)',
        slate: {
          25: 'var(--bg-light-25,rgb(252,253,254))',
          50: 'var(--bg-light-50,#f8fafc)',
          100: 'var(--bg-light-100,#f1f5f9)',
          200: 'var(--bg-light-200,#e8edf4)',
        },
        zinc: {
          700: '#34343b',
          800: '#1f1f24',
          900: '#121215',
          925: 'var(--bg-dark-925,#0c0c0e)',
          950: 'var(--bg-dark-950,#09090b)',
        },
        primary: {
          100: 'var(--primary-100,#f1f5f9)',
          900: 'var(--primary-900,#0f172a)',
        },
      },
    },
  },
  plugins: [],
}
