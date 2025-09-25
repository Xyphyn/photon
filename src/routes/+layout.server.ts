import { aliases, loadTranslations, locales } from '$lib/app/i18n'
import { get } from 'svelte/store'

export const load = async ({ request }) => {
  const languages = request.headers.get('Accept-Language')?.split(',')
  const availableLangs = get(locales)

  let preferredLanguage = 'en'

  if (!languages) {
    await loadTranslations(preferredLanguage)
    return
  }
  for (const lang of languages.reverse()) {
    const splitLang = lang.split(';')[0]
    if (availableLangs.includes(splitLang) || aliases.get(splitLang)) {
      preferredLanguage = aliases.get(splitLang) || splitLang
    }
  }
  await loadTranslations(preferredLanguage)
  return
}
