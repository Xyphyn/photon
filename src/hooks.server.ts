import { aliases, loadTranslations, locales } from '$lib/app/i18n'
import { getDefaultTheme } from '$lib/app/theme/presets'
import { calculateVars } from '$lib/app/theme/theme.svelte'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { get } from 'svelte/store'

// from https://github.com/mudkipdev/rephoton/commit/af81260173943ed054296ac64fb55555ff3460b9
export const handle: Handle = async ({ event, resolve }) => {
  await parseLanguages(event.request)

  return await resolve(event, {
    transformPageChunk: (page) =>
      page.html.replace('/*THEME_VARS*/', calculateVars(getDefaultTheme())),
  })
}

export const handleError: HandleServerError = async ({
  error,
  event,
  status,
  message,
}) => {
  if (status == 404) return

  console.error(`An error was captured:`)
  console.error(error)
  console.error(`Event:`, event)
  console.error(`Status:`, status)
  console.error(`Message:`, message)
}

const parseLanguages = async (request: Request) => {
  const languages = request.headers.get('Accept-Language')?.split(',')
  const currentLocales = get(locales)

  let preferredLanguage = 'en'
  if (languages) {
    for (const lang of languages.reverse()) {
      const splitLang = lang.split(';')[0]
      if (currentLocales.includes(splitLang) || aliases.get(splitLang)) {
        preferredLanguage = aliases.get(splitLang) || splitLang
      }
    }
  }

  await loadTranslations(preferredLanguage)
  return
}
