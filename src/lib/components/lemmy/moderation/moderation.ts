import type {
  CommentView,
  Community,
  CommunityView,
  MyUserInfo,
  Person,
  PersonView,
  PostView,
} from 'lemmy-js-client'
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
  banning: {
    open: boolean
    banned: boolean
    user: Person | undefined
    community: Community | undefined
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
  banning: {
    open: false,
    banned: false,
    user: undefined,
    community: undefined,
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

export function ban(banned: boolean, item: Person, community?: Community) {
  modals.update((m) => ({
    ...m,
    banning: {
      open: true,
      user: item,
      banned: banned,
      community,
    },
  }))
}

export const amMod = (me: MyUserInfo, community: Community) =>
  me.moderates.map((c) => c.community.id).includes(community.id) ||
  (community.local && isAdmin(me))

export const amModOfAny = (me?: MyUserInfo) =>
  me && (me.moderates.length > 0 || isAdmin(me))

export const isAdmin = (me: MyUserInfo) => me.local_user_view.person.admin
