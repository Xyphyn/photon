import { getLocaleFromNavigator, init, register } from 'svelte-i18n'
const defaultLocale = 'en'

register('en', () => import('./locale/en/common.json'))

register('en-US', () => import('./locale/en/common.json'))

register('es', () => import('./locale/es/common.json'))

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
})
