import type { CommentView, PostView } from 'lemmy-js-client'
import { writable } from 'svelte/store'

interface Modals {
  reporting: {
    open: boolean
    item: PostView | CommentView | undefined
  }
}

export let modals = writable<Modals>({
  reporting: {
    open: false,
    item: undefined,
  },
})

export function report(item: PostView | CommentView) {
  modals.update((m) => ({
    ...m,
    reporting: {
      open: true,
      item: item,
    },
  }))
}
