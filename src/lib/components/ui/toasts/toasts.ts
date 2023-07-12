import { writable } from 'svelte/store'

export enum ToastType {
  'error' = 'from-red-400 to-red-400 text-red-400',
  'warning' = 'from-yellow-300 to-yellow-300 text-yellow-300',
  'success' = 'from-green-400 to-green-400 text-green-400',
  'info' = '',
}

export interface Toast {
  id: number
  title: string | undefined
  content: string
  type: ToastType
}

export const toasts = writable<Toast[]>([])

export function toast({
  title,
  content,
  type = ToastType.info,
}: {
  title?: string
  content: string
  type: ToastType
}) {
  let id = 0

  toasts.update((toasts) => {
    id = Math.floor(Math.random() * 10000)

    return [
      {
        id: id,
        content: content,
        title: title,
        type: type,
      },
      ...toasts,
    ]
  })

  setTimeout(() => {
    toasts.update((toasts) => toasts.filter((toast) => toast.id != id))
  }, 5000)
}

/**
 * @deprecated use @function toast
 */
export function addToast(
  title: string | undefined,
  content: string,
  type: ToastType
) {
  let id = 0

  toasts.update((toasts) => {
    id = Math.floor(Math.random() * 10000)

    return [
      {
        id: id,
        content: content,
        title: title,
        type: type,
      },
      ...toasts,
    ]
  })

  setTimeout(() => {
    toasts.update((toasts) => toasts.filter((toast) => toast.id != id))
  }, 5000)
}
