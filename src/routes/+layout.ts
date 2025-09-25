import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'
import { aliases, loadTranslations } from '$lib/app/i18n'
import { settings } from '$lib/app/settings.svelte'

export const ssr = env.PUBLIC_SSR_ENABLED?.toLowerCase() == 'true'

export const load = async () => {
  if (browser) {
    const initLocale = settings.language ?? navigator?.language ?? 'en'

    console.log(`Loading locale ${aliases.get(initLocale) ?? initLocale}`)

    await loadTranslations(aliases.get(initLocale) ?? initLocale)
  }

  return
}
