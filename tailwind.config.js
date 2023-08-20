/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.{js,ts,svelte,html}'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      'sans': ['Cantarell', 'system-ui'],
      'serif': ['serif']
    },
    extend: {
      animation: {
        'pop-in': 'pop-in 0.25s ease-out forwards'
      },
      keyframes: {
        'pop-in': {
          '0%, 100%': { transform: 'translateX(8px)', opacity: 0 }
        }
      },
      colors: {
        'zinc': {
          800: '#1f1f25',
          900: '#121215'
        }
      }
    },
  },
  plugins: [],
}

