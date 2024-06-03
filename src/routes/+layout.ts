import { env } from '$env/dynamic/public'
import { loadTranslations } from '$lib/translations.js'

export let ssr = (env.PUBLIC_SSR_ENABLED?.toLowerCase() ?? 'false') == 'true'

export const load = async ({ url }) => {
  await loadTranslations('en')

  return
}
