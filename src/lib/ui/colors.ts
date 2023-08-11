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

export const theme = writable<'system' | 'light' | 'dark'>('system')

export const toggleTheme = () => {
  theme.update((theme) => {
    if (theme == 'light') {
      return 'dark'
    } else if (theme == 'dark') {
      return 'system'
    } else {
      return 'light'
    }
  })
}

export const inDarkTheme = (): boolean => {
  if (typeof window != 'undefined') {
    return get(theme) == 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : get(theme) == 'dark'
  }
  return false
}

if (typeof localStorage != 'undefined') {
  const localTheme: 'system' | 'light' | 'dark' =
    (localStorage.getItem('theme') as 'system' | 'light' | 'dark') || 'system'

  theme.update((theme) => localTheme)

  theme.subscribe((theme) => {
    if (typeof document != 'undefined') {
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches

      const html = document.querySelector('html')

      if (theme == 'system') {
        html?.classList.toggle('dark', prefersDark)
      } else {
        html?.classList.toggle('dark', theme === 'dark')
      }

      localStorage.setItem('theme', theme)
    }
  })
}
