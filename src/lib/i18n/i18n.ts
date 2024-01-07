import { browser } from "$app/environment"
import { getLocaleFromNavigator, init, register } from "svelte-i18n"

export const defaultLocale = 'en'

register('en', () => import('./locale/en/nav.json') )
register('en', () => import('./locale/en/common.json') )
register('en', () => import('./locale/en/notifications.json'))
register('en', () => import('./locale/en/pages.json'))

init({
  fallbackLocale: 'en',
  initialLocale: browser ? window.navigator.language : defaultLocale
})