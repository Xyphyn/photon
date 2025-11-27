import { aliases, loadTranslations, locales } from '$lib/app/i18n'
import { initDataCookie } from '$lib/app/server/userHost.js'
import { get } from 'svelte/store'

export const load = async ({ request, cookies }) => {
  const languages = request.headers.get('Accept-Language')?.split(',')
  const availableLangs = get(locales)

  let preferredLanguage = 'en'

  if (!languages) {
    await loadTranslations(preferredLanguage)
  } else {
    for (const lang of languages.reverse()) {
      const splitLang = lang.split(';')[0]
      if (availableLangs.includes(splitLang) || aliases.get(splitLang)) {
        preferredLanguage = aliases.get(splitLang) || splitLang
      }
    }
    await loadTranslations(preferredLanguage)
  }

  const userHost = await initDataCookie(cookies)

  return { userHost }
}
