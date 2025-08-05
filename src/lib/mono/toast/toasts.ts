import { writable } from 'svelte/store'

type ToastType = keyof typeof toastColors

export const toastColors = {
  error: 'bg-red-100/50 dark:bg-red-900/20 border-red-300/40 border',
  warning: 'bg-yellow-100/50 dark:bg-yellow-500/5 border-yellow-500/40 border',
  success: 'bg-green-100/50 dark:bg-green-900/20 border-green-300/40 border',
  info: 'dark:bg-zinc-925/90 bg-white border border-slate-200 dark:border-zinc-800',
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
    id = Math.max(0, ...toasts.map(t => t.id)) + 1

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
