// See https://kit.svelte.dev/docs/types#app

import type { Action } from '$lib/components/ui/navbar/commands/actions.svelte'

// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      instance?: string
    }
    interface PageData {
      slots?: {
        sidebar?: {
          component?: Component<Props, unknown, 'community_view'>
          props?: any
        }
      }
      contextual?: {
        actions?: Action[]
      }
    }
    interface PageState {
      openImage?: string
      openModals?: string[]
    }
    // interface Platform {}
  }
  declare const __VERSION__: string
}

export {}
// eslint-disable-next-line
declare const __VERSION__: string

declare module 'markdown-it-sub'
declare module 'markdown-it-sup'
