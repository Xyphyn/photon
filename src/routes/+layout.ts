import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'
import { locale, waitLocale } from 'svelte-i18n'
import { defaultLocale } from '$lib/i18n/i18n'

export let ssr = (env.PUBLIC_SSR_ENABLED?.toLowerCase() ?? 'false') == 'true'

export const load = async () => {
  if (browser) {
    locale.set(window.navigator.language)
  }
  await waitLocale()
}