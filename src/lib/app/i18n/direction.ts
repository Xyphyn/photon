// Language direction metadata. Intentionally a small hardcoded list — no Intl,
// no CLDR, no fetching. Extend as needed.
//
// Excluded on purpose: `ku` (Kurmanji is Latin/LTR; Sorani is `ckb`).
export const RTL_LANGUAGES = [
  'ar',
  'arc',
  'ckb',
  'dv',
  'fa',
  'he',
  'nqo',
  'prs',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
]

const base = (lang?: string | null) => lang?.toLowerCase().split(/[-_]/)[0]

export const isRtl = (lang?: string | null): boolean =>
  RTL_LANGUAGES.includes(base(lang) ?? '')

/** `'ltr' | 'rtl'` for the given language code, e.g. `dir={directionFor($locale)}`. */
export const directionFor = (lang?: string | null): 'ltr' | 'rtl' =>
  isRtl(lang) ? 'rtl' : 'ltr'
