// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      instance?: string
    }
    // interface PageData {}
    // interface Platform {}
  }
  declare const __VERSION__: string
}

export {}
declare const __VERSION__: string

declare module 'markdown-it-sub'
declare module 'markdown-it-sup'
