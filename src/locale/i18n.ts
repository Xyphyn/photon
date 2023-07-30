import { browser } from '$app/environment'
import { getLocaleFromNavigator, init, register } from 'svelte-i18n'

register('en', () => import('./en/ui/button.json'))
register('es', () => import('./es/ui/button.json'))

init({
  fallbackLocale: 'en',
  initialLocale: browser ? window.navigator.language : 'en',
})
