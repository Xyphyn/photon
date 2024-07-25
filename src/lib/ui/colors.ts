import {
  derived,
  get,
  writable,
  type Stores,
  type Updater,
  type Unsubscriber,
  type Writable,
  type Readable,
} from 'svelte/store'
import { env } from '$env/dynamic/public'
import { presets } from './presets'

type ColorScheme = 'system' | 'light' | 'dark'

interface ThemeData {
  scheme: ColorScheme
  themes: Theme[]
  currentTheme: number
}

export interface Theme {
  id: number
  colors: ThemeColors
  name: string
}

interface ThemeColors {
  [scheme: string]: {
    [key: string]: string
  }
}

export function getDefaultColors(): ThemeColors {
  return env.PUBLIC_THEME
    ? JSON.parse(env.PUBLIC_THEME)
    : {
        slate: {
          25: '252 253 254',
          50: '248 250 252',
          100: '241 245 249',
          200: '226 232 240',
          300: '203 213 225',
          400: '148 163 184',
          500: '100 116 139',
          600: '71 85 105',
          700: '51 65 85',
          800: '30 41 59',
          900: '15 23 42',
          950: '2 6 23',
        },
        zinc: {
          50: `249 250 251`,
          100: `243 244 246`,
          200: `229 231 235`,
          300: `209 213 219`,
          400: `156 163 175`,
          500: `107 114 128`,
          600: `75 85 99`,
          700: '50 60 76',
          800: '22 31 45',
          900: '17 24 39',
          925: '8 12 25',
          950: `5 9 16`,
        },
        primary: {
          100: 'var(--c-p-100,241 245 249)',
          900: 'var(--c-p-900,15 23 42)',
        },
        other: {
          black: `var(--c-o-black,0 0 0)`,
          white: `var(--c-o-white,255 255 255)`,
        },
      }
}

export function getDefaultTheme(): Theme {
  return {
    id: 0,
    colors: getDefaultColors(),
    name: 'Default',
  }
}

export function hexToRgb(value: string) {
  // Regular expression to match valid hex color codes
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/

  if (!hexRegex.test(value)) {
    return value // Not a valid hex color
  }

  // Remove # if present
  let hex = value.replace('#', '')

  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  // Convert to RGB values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return `${r} ${g} ${b}`
}

function themeStore(
  data: Writable<ThemeData>,
  fn: (
    values: ThemeData,
    set: (value: Theme) => void,
    update: (fn: Updater<Theme>) => void
  ) => any
) {
  const derive: Readable<Theme> = derived(data, fn)
  const { subscribe } = derive

  return {
    subscribe,
    set: (value: Theme) => {
      data.update((data) => {
        let index = data.themes.findIndex((t) => t.id == value.id)
        data.themes[index] = value
        return data
      })
    },
  }
}

export let themeData = writable<ThemeData>({
  scheme: 'system',
  themes: presets,
  currentTheme: 0,
})

export let theme = themeStore(
  themeData,
  (data) =>
    data.themes.find((t) => t.id == data.currentTheme) ?? getDefaultTheme()
)

export function calculateVars(theme: Theme) {
  let cssVariables = ''

  for (const [scheme, colors] of Object.entries(theme.colors)) {
    for (const [key, value] of Object.entries(colors)) {
      cssVariables += `--c-${scheme[0]}-${key}:${hexToRgb(value)}; `
    }
  }

  return cssVariables.trim()
}

export const themeVars = derived(theme, (t) => calculateVars(t as Theme))

const configuredColorScheme = env.PUBLIC_COLORSCHEME ?? 'system'
export const colorScheme = writable<ColorScheme>(
  configuredColorScheme as ColorScheme
)

export const toggleColorScheme = () => {
  colorScheme.update((colorScheme) => {
    if (colorScheme == 'light') return 'dark'
    else if (colorScheme == 'dark') return 'system'
    else return 'light'
  })
}

export const inDarkColorScheme = (): boolean => {
  if (typeof window != 'undefined') {
    return get(colorScheme) == 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : get(colorScheme) == 'dark'
  }
  return false
}

if (typeof localStorage != 'undefined') {
  const localColorScheme: ColorScheme =
    (localStorage.getItem('colorScheme') as ColorScheme) ||
    configuredColorScheme

  colorScheme.update((colorScheme) => localColorScheme)

  colorScheme.subscribe((colorScheme) => {
    if (typeof document != 'undefined') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

      const html = document.querySelector('html')

      if (colorScheme == 'system') {
        html?.classList.toggle('dark', prefersDark)
      } else {
        html?.classList.toggle('dark', colorScheme === 'dark')
      }

      localStorage.setItem('colorScheme', colorScheme)
    }
  })
}
