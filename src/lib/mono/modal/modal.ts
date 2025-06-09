import type { IconSource } from 'svelte-hero-icons'
import { writable } from 'svelte/store'

export const shownModal = writable<Modal | undefined>()

interface Modal {
  actions: Action[]
  title: string
  body?: string
  /**
   * Whether the modal has a close button or not
   */
  dismissable: boolean
  type: 'error' | 'info' | 'success'
}

type Action = {
  /**
   * What function to run when this action is clicked. If undefined, it'll close the window.
   */
  action: () => void
  type: 'danger' | 'secondary' | 'primary'
  content: string
  icon?: IconSource
  close: boolean
}

export const action = (action?: {
  action?: () => void
  type?: 'danger' | 'secondary' | 'primary'
  content?: string
  icon?: IconSource
  close?: boolean
}): Action => ({
  action: action?.action
    ? () => {
        action?.action?.()
        if (action.close) shownModal.set(undefined)
      }
    : () => shownModal.set(undefined),
  type: action?.type ?? 'secondary',
  content: action?.content || 'OK',
  close: action?.close ?? true,
})

export function modal(inputModal: {
  actions?: Action[]
  title: string
  body: string
  /**
   * Whether the modal has a close button or not
   */
  dismissable?: boolean
  type?: 'error' | 'info' | 'success'
}) {
  const modal: Modal = {
    actions: inputModal.actions ?? [action()],
    dismissable: inputModal.dismissable ?? true,
    title: inputModal.title,
    body: inputModal.body,
    type: inputModal.type ?? 'info',
  }

  shownModal.set(modal)
}
