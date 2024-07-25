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
import { getDefaultTheme, presets } from './presets'
import { browser } from '$app/environment'

type ColorScheme = 'system' | 'light' | 'dark'

export interface ThemeData {
  scheme: ColorScheme
  themes: Theme[]
  currentTheme: number
}

export interface Theme {
  id: number
  colors: ThemeColors
  name: string
}

export interface ThemeColors {
  [scheme: string]: {
    [key: string]: string
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

export let themeData = writable<ThemeData>(
  loadTheme() ?? {
    scheme: 'system',
    themes: presets,
    currentTheme: 0,
  }
)

themeData.subscribe((themeData) => {
  if (browser) {
    localStorage.setItem('themeData', JSON.stringify(themeData))
  }
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

function loadColorScheme() {
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

function loadTheme() {
  if (!browser) return
  const localTheme = localStorage.getItem('themeData')
  if (localTheme) {
    return JSON.parse(localTheme)
  }
  return
}

if (browser) {
  try {
    loadColorScheme()
  } catch (e) {}
}
