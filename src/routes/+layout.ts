import { browser } from '$app/environment'
import { settings } from '$lib/settings.svelte'
import { aliases, loadTranslations } from '$lib/i18n/translations.js'

export const ssr = false

export const load = async () => {
  if (browser) {
    const initLocale = settings.language ?? navigator?.language ?? 'en'

    console.log(`Loading locale ${aliases.get(initLocale) ?? initLocale}`)

    await loadTranslations(aliases.get(initLocale) ?? initLocale)
  }

  return
}
