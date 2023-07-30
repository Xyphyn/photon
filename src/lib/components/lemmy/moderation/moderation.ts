import type {
  CommentView,
  Community,
  CommunityView,
  MyUserInfo,
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

export const amMod = (me: MyUserInfo, community: Community) =>
  me.moderates.map((c) => c.community.id).includes(community.id) ||
  (community.local && amAdmin(me))

export const amModOfAny = (me?: MyUserInfo) =>
  me && (me.moderates.length > 0 || amAdmin(me))

export const amAdmin = (me: MyUserInfo) => me.local_user_view.person.admin

export const amAdminOfCommunity = (me: MyUserInfo, community: Community) =>
  me.local_user_view.person.admin && community.local
