import { t } from "./i18n"

// eslint-disable-next-line
export function errorMessage(error: any, instance?: string): string {
  try {
    if (typeof error == 'string') {
      try {
        error = JSON.parse(error)
      } catch { 
        /* try without catch would be cool imo */
      }
    }

    if (error?.body?.message) {
      error = JSON.parse(error?.body?.message).error
    } else if (error?.message) {
      error = error?.message
    } else if (error?.error && typeof error?.error === 'string') {
      error = error.error
    }
    if (!error) throw error

    return t.get(`error.${error}`)
  } catch {
    return error as any
  }
}
