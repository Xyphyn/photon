import { aliases, loadTranslations, locales } from '$lib/app/i18n'
import { directionFor } from '$lib/app/i18n/direction'
import { getDefaultTheme } from '$lib/app/theme/presets'
import { calculateVars } from '$lib/app/theme/theme.svelte'
import type { Handle, HandleServerError } from '@sveltejs/kit'
import { get } from 'svelte/store'

// from https://github.com/mudkipdev/rephoton/commit/af81260173943ed054296ac64fb55555ff3460b9
export const handle: Handle = async ({ event, resolve }) => {
  const language = await parseLanguages(event.request)
  const preferredLanguage = parsePreferredLanguage(event.request)

  return await resolve(event, {
    transformPageChunk: (page) =>
      page.html
        .replace('/*THEME_VARS*/', calculateVars(getDefaultTheme()))
        .replace('/*DIR*/', directionFor(preferredLanguage))
        .replace('/*LANG*/', language),
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
  return preferredLanguage
}

/**
 * First language tag from `Accept-Language`, without the region subtag and
 * regardless of translation availability. Direction follows this; translations
 * keep falling back to supported locales via `parseLanguages`.
 */
const parsePreferredLanguage = (request: Request) => {
  const first = request.headers
    .get('Accept-Language')
    ?.split(',')[0]
    ?.split(';')[0]
    ?.trim()

  return first || 'en'
}
