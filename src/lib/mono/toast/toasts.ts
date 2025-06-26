import { writable } from 'svelte/store'

type ToastType = keyof typeof toastColors

export const toastColors = {
  error: 'bg-white dark:bg-zinc-925 text-red-500 shadow-red-400/30 shadow-sm',
  warning:
    'bg-white dark:bg-zinc-925 text-yellow-500 shadow-yellow-400/30 shadow-sm',
  success:
    'bg-white dark:bg-zinc-925 text-green-600 dark:text-green-400 shadow-green-400/30 shadow-sm',
  info: 'dark:bg-zinc-925 bg-white border border-slate-200 dark:border-zinc-800',
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

  toasts.update(toasts => {
    id = Math.floor(Math.random() * 10000)

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
    toasts.update(toasts => toasts.filter(toast => toast.id != id))
  }, duration)

  return id
}

export const removeToast = (id: number) =>
  toasts.update(toasts => toasts.filter(toast => toast.id != id))
