import type { CommentView, MyUserInfo, PostView } from 'lemmy-js-client'
import { writable } from 'svelte/store'

interface Modals {
  reporting: {
    open: boolean
    item: PostView | CommentView | undefined
  }
  removing: {
    open: boolean
    item: PostView | CommentView | undefined
  }
}

export let modals = writable<Modals>({
  reporting: {
    open: false,
    item: undefined,
  },
  removing: {
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

export function remove(item: PostView | CommentView) {
  modals.update((m) => ({
    ...m,
    removing: {
      open: true,
      item: item,
    },
  }))
}

export const isMod = (me: MyUserInfo, community: number) =>
  me.moderates.map((c) => c.community.id).includes(community)

export const isModOfAny = (me?: MyUserInfo) => me && me.moderates.length > 0

export const isAdmin = (me: MyUserInfo) => me.local_user_view.person.admin
