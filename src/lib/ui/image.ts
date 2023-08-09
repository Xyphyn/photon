export const isImage = (url: string | undefined) => {
  if (!url) return false

  return /\.(jpeg|jpg|gif|png|svg|bmp|webp)$/i.test(new URL(url).pathname)
}

export const isVideo = (inputUrl: string | undefined) => {
  if (!inputUrl) return false

  const url = new URL(inputUrl).pathname.toLowerCase()

  return url.endsWith('mp4') || url.endsWith('webm') || url.endsWith('mov')
}

import { writable } from 'svelte/store'

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
