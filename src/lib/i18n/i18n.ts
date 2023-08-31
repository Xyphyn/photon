import { browser } from '$app/environment'
import { userSettings } from '$lib/settings.js'
import { getLocaleFromNavigator, init, locale, register } from 'svelte-i18n'
const defaultLocale = 'en'

register('en', () => import('./locale/en/common.json'))
register('en', () => import('./locale/en/pages.json'))

register('es', () => import('./locale/es/common.json'))
register('es', () => import('./locale/es/pages.json'))

function getLocale() {
  if (browser) {
    const l = localStorage.getItem('locale')
    if (l) return l
    else return navigator.language
  } else return defaultLocale
}

init({
  fallbackLocale: 'en',
  initialLocale: getLocale(),
})

userSettings.subscribe((u) => {
  if (!browser) return

  if (u.language) {
    localStorage.setItem('locale', u.language)
  } else {
    localStorage.removeItem('locale')
  }

  locale.set(u.language)
})
