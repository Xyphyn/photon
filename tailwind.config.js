/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.{js,ts,svelte,html}'],
  theme: {
    extend: {
      animation: {
        'pop-in': 'pop-in 0.25s ease-out forwards'
      },
      keyframes: {
        'pop-in': {
          '0%, 100%': { transform: 'translateX(8px)', opacity: 0 }
        }
      }
    },
  },
  plugins: [],
}

