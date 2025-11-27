import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'
import { aliases, loadTranslations } from '$lib/app/i18n'
import { settings } from '$lib/app/settings.svelte'

export const ssr = env.PUBLIC_SSR_ENABLED?.toLowerCase() == 'true'

export async function load({ parent }) {
  if (browser) {
    const initLocale = settings.value.language ?? navigator?.language ?? 'en'

    console.log(`Loading locale ${aliases.get(initLocale) ?? initLocale}`)

    await loadTranslations(aliases.get(initLocale) ?? initLocale)
  }

  // ok so sveltekit is supposed to combine things from
  // waterfalling layouts, but i dont think it does here
  const data = await parent()

  return data
}
