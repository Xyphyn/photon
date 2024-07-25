import { getDefaultColors, getDefaultTheme, type Theme } from './colors'

export const presets: Theme[] = [
  getDefaultTheme(),
  {
    colors: {
      slate: {
        25: '#fcfdfe',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      zinc: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#34343b',
        800: '#1f1f24',
        900: '#121215',
        925: '#0c0c0e',
        950: '#09090b',
      },
      primary: {
        100: '#f1f5f9',
        900: '#0f172a',
      },
      other: {
        black: '#000000',
        white: '#ffffff',
      },
    },
    id: -1,
    name: 'Classic',
  },
  {
    colors: {
      zinc: {
        50: '#cdd6f4',
        100: '#bac2de',
        200: '#a6adc8',
        300: '#9399b2',
        400: '#7f849c',
        500: '#6c7086',
        600: '#585b70',
        700: '#45475a',
        800: '#313244',
        900: '#1e1e2e',
        925: '#181825',
        950: '#11111b',
      },
      primary: {
        100: '#a6e3a1',
        900: '#7287fd',
      },
      other: {
        white: '#ffffff',
      },
      slate: {},
    },
    id: -2,
    name: 'Catppuccin',
  },
]
