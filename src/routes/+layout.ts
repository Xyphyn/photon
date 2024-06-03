import { env } from '$env/dynamic/public'
import { userSettings } from '$lib/settings.js'
import { loadTranslations } from '$lib/translations.js'
import { get } from 'svelte/store'

export let ssr = (env.PUBLIC_SSR_ENABLED?.toLowerCase() ?? 'false') == 'true'

export const load = async ({}) => {
  const initLocale = get(userSettings)?.language ?? navigator?.language ?? 'en'

  console.log(`Loading locale ${initLocale}`)

  await loadTranslations(initLocale)

  return
}
