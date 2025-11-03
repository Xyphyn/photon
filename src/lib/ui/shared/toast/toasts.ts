import { writable } from 'svelte/store'

type ToastType = keyof typeof toastColors

export const toastColors = {
  error: 'material-error',
  warning: 'material-warning',
  success: 'material-success',
  info: 'material-info',
}

export interface Toast {
  id: number
  title?: string
  content: string
  type: ToastType
  loading?: boolean
  long?: boolean
  action?: () => void
}

export const toasts = writable<Toast[]>([])

export function toast({
  title,
  content,
  type = 'info',
  duration = 5000,
  loading = false,
  long = false,
  action,
}: {
  title?: string
  content: string
  type?: ToastType
  duration?: number
  loading?: boolean
  long?: boolean
  action?: () => void
}) {
  let id = 0

  toasts.update((toasts) => {
    id = Math.max(0, ...toasts.map((t) => t.id)) + 1

    return [
      ...toasts,
      {
        id: id,
        content: content,
        title: title,
        type: type,
        loading: loading,
        long: long,
        action: action,
      },
    ]
  })

  setTimeout(() => {
    toasts.update((toasts) => toasts.filter((toast) => toast.id != id))
  }, duration)

  return id
}

export const removeToast = (id: number) =>
  toasts.update((toasts) => toasts.filter((toast) => toast.id != id))
