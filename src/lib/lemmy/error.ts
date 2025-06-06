import { t } from '$lib/i18n/translations'

export function errorMessage(error: any, instance?: string): string {
  try {
    if (error?.body?.message) {
      error = JSON.parse(error?.body?.message).error
    } else if (error?.message) {
      error = error?.message
    } else if (error?.error && typeof error?.error === 'string') {
      error = error.error
    }
    if (!error) throw error

    return t.get(`error.${error}`)
  } catch (e) {
    return error as any
  }
}
