import type { Submission } from '$lib/lemmy/contentview.js'
import type { Community, MyUserInfo, Person } from 'lemmy-js-client'
import { writable } from 'svelte/store'

interface Modals {
  reporting: {
    open: boolean
    item: Submission | undefined
  }
  removing: {
    open: boolean
    item: Submission | undefined
    purge: boolean
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
    purge: false,
  },
  banning: {
    open: false,
    banned: false,
    user: undefined,
    community: undefined,
  },
})

export function report(item: Submission) {
  modals.update((m) => ({
    ...m,
    reporting: {
      open: true,
      item: item,
    },
  }))
}

export function remove(item: Submission, purge: boolean = false) {
  modals.update((m) => ({
    ...m,
    removing: {
      open: true,
      item: item,
      purge: purge,
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

export const removalTemplate = (
  input: string,
  content: {
    postTitle?: string
    communityLink?: string
    username?: string
    reason?: string
  }
) => {
  if (content.postTitle) input = input.replaceAll('{{post}}', content.postTitle)
  if (content.communityLink)
    input = input.replaceAll('{{community}}', content.communityLink)
  if (content.username)
    input = input.replaceAll('{{username}}', content.username)
  if (content.reason) input = input.replaceAll('{{reason}}', content.reason)
  return input
}
