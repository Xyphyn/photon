import { writable } from 'svelte/store'

export enum ToastType {
  'error' = 'bg-red-500 text-black border border-red-600',
  'warning' = 'bg-yellow-400 text-black border border-yellow-500',
  'success' = 'bg-green-400 text-black border border-green-500',
  'info' = 'dark:bg-zinc-900 bg-white border border-slate-200 dark:border-zinc-800 shadow-lg',
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
  duration = 5000,
}: {
  title?: string
  content: string
  type?: ToastType
  duration?: number
}) {
  let id = 0

  toasts.update((toasts) => {
    id = Math.floor(Math.random() * 10000)

    return [
      ...toasts,
      {
        id: id,
        content: content,
        title: title,
        type: type,
      },
    ]
  })

  setTimeout(() => {
    toasts.update((toasts) => toasts.filter((toast) => toast.id != id))
  }, duration)
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
