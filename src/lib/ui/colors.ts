/**
 * This enum represents a UI color as tailwind classes.
 */

export enum Color {
  'accent' = 'border border-black dark:border-white bg-black text-white\
    dark:bg-white dark:text-black hover:text-inherit hover:bg-transparent hover:dark:bg-transparent active:bg-black/10 active:dark:bg-white/10',
  'ghost' = 'bg-black/5 dark:bg-white/5 hover:bg-black/10 hover:dark:bg-white/10 text-black dark:text-white border border-transparent',
  'secondary' = 'hover:bg-black/10 hover:dark:bg-white/10 text-black dark:text-white fill-black dark:fill-white',
  'danger' = 'border border-red-500 bg-red-500 text-white hover:text-red-500 hover:bg-transparent',
  'dangerSecondary' = 'hover:bg-red-500 text-red-500 hover:text-white',
  'border' = 'border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 hover:dark:bg-zinc-700',
  'borderDark' = 'border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 hover:dark:bg-zinc-800',
}

import { get, writable } from 'svelte/store'
import { env } from '$env/dynamic/public'
import { browser } from '$app/environment'

interface ColorData {
  theme: number
  themes: Colors[]
}

interface Theme {
  colors: Colors
  name: string
  id: number
}

export interface Colors {
  slate: {
    25?: string,
    50?: string
    100?: string
    200?: string
    400?: string
    500?: string
    600?: string
    700?: string
    800?: string
    900?: string
    925?: string
    950?: string
  },
  zinc: {
    100?: string
    200?: string
    300?: string
    400?: string
    500?: string
    600?: string
    700?: string
    800?: string
    900?: string
    925?: string
    950?: string
  },
  primary: {
    100?: string,
    900?: string,
  },
  other: {
    black?: string,
    white?: string
  }
}

export const defaultColors = {
  slate: {
    25: `var(--c-s-25,#fcfdfe)`,
    50: `var(--c-s-50,#f8fafc)`,
    100: `var(--c-s-100,#f1f5f9)`,
    200: `var(--c-s-200,#e2e8f0)`,
    300: `var(--c-s-300,#cbd5e1)`,
    400: `var(--c-s-400,#94a3b8)`,
    500: `var(--c-s-500,#64748b)`,
    600: `var(--c-s-600,#475569)`,
    700: `var(--c-s-700,#334155)`,
    800: `var(--c-s-800,#1e293b)`,
    900: `var(--c-s-900,#0f172a`,
    950: `var(--c-s-950,#020617)`,
  },
  zinc: {
    50: `var(--c-z-50,#fafafa)`,
    100: `var(--c-z-100,#f4f4f5)`,
    200: `var(--c-z-200,#e4e4e7)`,
    300: `var(--c-z-300,#d4d4d8)`,
    400: `var(--c-z-400,#a1a1aa)`,
    500: `var(--c-z-500,#71717a)`,
    600: `var(--c-z-600,#52525b)`,
    700: 'var(--c-z-700,#34343b)',
    800: 'var(--c-z-800,#1f1f24)',
    900: 'var(--c-z-900,#121215)',
    925: 'var(--c-z-925,#0c0c0e)',
    950: `var(--c-z-950,#09090b)`,
  },
  primary: {
    100: 'var(--c-p-100,#f1f5f9)',
    900: 'var(--c-p-900,#0f172a)',
  },
  other: {
    black: `#000`,
    white: `var(--c-o-white,#fff)`
  }
}

export let colors = writable<Colors>({
  slate: {},
  zinc: {},
  primary: {},
  other: {}
})

export function colorsToVars(colors: Colors): string {
  let vars: string[] = []
  for (let category in colors) {
    for (let shade in colors[category as keyof Colors]) {
      if (category)
        // @ts-ignore
        vars.push(`--c-${category.slice(0, 1)}-${shade}:${colors[category][shade]}`)
    }
  }
  return vars.join(';')
}

export const colorToVar = (category: keyof Colors, shade: keyof keyof Colors): string =>
  `--c-${category.slice(0,2)}-${shade.toString()}`


function loadColors() {
  const loaded = localStorage.getItem('colors')
  if (loaded) {
    colors.set(JSON.parse(loaded))
  }
  colors.subscribe((v) => {
    localStorage.setItem('colors', JSON.stringify(v))
  })
}

if (browser) {
  loadColors()
}


const configuredLegacyTheme = env.PUBLIC_LEGACYTHEME ?? 'system'
export const legacyTheme = writable<'system' | 'light' | 'dark'>(
  configuredLegacyTheme as 'system' | 'light' | 'dark'
)

export const toggleLegacyTheme = () => {
  legacyTheme.update((legacyTheme) => {
    if (legacyTheme == 'light') {
      return 'dark'
    } else if (legacyTheme == 'dark') {
      return 'system'
    } else {
      return 'light'
    }
  })
}

export const inDarkLegacyTheme = (): boolean => {
  if (typeof window != 'undefined') {
    return get(legacyTheme) == 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : get(legacyTheme) == 'dark'
  }
  return false
}

if (typeof localStorage != 'undefined') {
  const localLegacyTheme: 'system' | 'light' | 'dark' =
    (localStorage.getItem('legacyTheme') as 'system' | 'light' | 'dark') ||
    configuredLegacyTheme

  legacyTheme.update((legacyTheme) => localLegacyTheme)

  legacyTheme.subscribe((legacyTheme) => {
    if (typeof document != 'undefined') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

      const html = document.querySelector('html')

      if (legacyTheme == 'system') {
        html?.classList.toggle('dark', prefersDark)
      } else {
        html?.classList.toggle('dark', legacyTheme === 'dark')
      }

      localStorage.setItem('legacyTheme', legacyTheme)
    }
  })
}
