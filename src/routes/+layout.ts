import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'
import { locale, waitLocale } from 'svelte-i18n'
import '$lib/i18n/i18n.js'

export let ssr = (env.PUBLIC_SSR_ENABLED?.toLowerCase() ?? 'false') == 'true'

export async function load() {
  if (browser) {
    if (localStorage.locale) {
      locale.set(localStorage.locale)
    } else {
      locale.set(window.navigator.language)
    }
  }

  await waitLocale()
}
