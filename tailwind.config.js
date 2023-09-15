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
        slate: {
          25: 'rgb(252,253,254)',
        },
        zinc: {
          700: '#34343b',
          800: '#1f1f24',
          900: '#121215',
        },
        primary: {
          100: '#f1f5f9',
          900: '#0f172a',
        },
      },
    },
  },
  plugins: [],
}
