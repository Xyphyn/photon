import i18n, { type Config, type Parser } from 'sveltekit-i18n'

const config: Config = {
  loaders: [
    {
      locale: 'en',
      key: '',
      loader: async () => (await import('./en.json')).default,
    },
    {
      locale: 'he',
      key: '',
      loader: async () => (await import('./he.json')).default,
    },
    {
      locale: 'ar',
      key: '',
      loader: async () => (await import('./ar.json')).default,
    },
    {
      locale: 'bg',
      key: '',
      loader: async () => (await import('./bg.json')).default,
    },
    {
      locale: 'de',
      key: '',
      loader: async () => (await import('./de.json')).default,
    },
    {
      locale: 'es',
      key: '',
      loader: async () => (await import('./es.json')).default,
    },
    {
      locale: 'et',
      key: '',
      loader: async () => (await import('./et.json')).default,
    },
    {
      locale: 'fi',
      key: '',
      loader: async () => (await import('./fi.json')).default,
    },
    {
      locale: 'fr',
      key: '',
      loader: async () => (await import('./fr.json')).default,
    },
    {
      locale: 'hu',
      key: '',
      loader: async () => (await import('./hu.json')).default,
    },
    {
      locale: 'ja',
      key: '',
      loader: async () => (await import('./ja.json')).default,
    },
    {
      locale: 'nl',
      key: '',
      loader: async () => (await import('./nl.json')).default,
    },
    {
      locale: 'pl',
      key: '',
      loader: async () => (await import('./pl.json')).default,
    },
    {
      locale: 'pt',
      key: '',
      loader: async () => (await import('./pt.json')).default,
    },
    {
      locale: 'pt-BR',
      key: '',
      loader: async () => (await import('./pt-BR.json')).default,
    },
    {
      locale: 'ru',
      key: '',
      loader: async () => (await import('./ru.json')).default,
    },
    {
      locale: 'tr',
      key: '',
      loader: async () => (await import('./tr.json')).default,
    },
    {
      locale: 'zh-Hans',
      key: '',
      loader: async () => (await import('./zh-Hans.json')).default,
    },
    {
      locale: 'zh-Hant',
      key: '',
      loader: async () => (await import('./zh-Hant.json')).default,
    },
  ],
  fallbackLocale: 'en',
}

export const aliases = new Map([
  ['zh-CN', 'zh-Hans'],
  ['zh-TW', 'zh-Hant'],
  ['en-US', 'en'],
  ['en-GB', 'en'],
  ['en-AU', 'en'],
  ['en-CA', 'en'],
  ['fr-FR', 'fr'],
  ['fr-CA', 'fr'],
  ['fr-BE', 'fr'],
  ['de-DE', 'de'],
  ['de-AT', 'de'],
  ['de-CH', 'de'],
  ['pt-BR', 'pt'],
  ['pt-PT', 'pt'],
  ['fi-FI', 'fi'],
  ['et-EE', 'et'],
  ['he-IL', 'he'],
])

export const { t, locale, locales, loading, loadTranslations } = new i18n<
  Parser.Params<any, object>,
  object,
  object
>(config)
