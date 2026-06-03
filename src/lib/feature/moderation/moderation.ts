// TODO update to svelte 5 type stuff

import { client } from '$lib/api/client.svelte'
import type { Comment, Community, Person, PrivateMessageView } from '$lib/api/types'
import { writable } from 'svelte/store'
import type { CommentModel } from '../comment/comment.svelte'
import type { PostModel } from '../post/post.svelte'

interface Modals {
  reporting: {
    open: boolean
    item: PostModel | CommentModel | PrivateMessageView | undefined
  }
  removing: {
    open: boolean
    item: PostModel | CommentModel | undefined
    purge: boolean
  }
  banning: {
    open: boolean
    banned: boolean
    user: Person | undefined
    community: Community | undefined
  }
  votes: {
    open: boolean
    item: PostModel | CommentModel | undefined
  }
}

export const modals = writable<Modals>({
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
  votes: {
    open: false,
    item: undefined,
  },
})

export function report(item: PostModel | CommentModel | PrivateMessageView) {
  modals.update((m) => ({
    ...m,
    reporting: {
      open: true,
      item: item,
    },
  }))
}

export function remove(item: PostModel | CommentModel, purge: boolean = false) {
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

export async function feature(featured: boolean, item: Comment) {
  return await client().distinguishComment({
    comment_id: item.id,
    distinguished: featured,
  })
}

export async function viewVotes(item: PostModel | CommentModel) {
  modals.update((m) => ({
    ...m,
    votes: {
      open: true,
      item: item,
    },
  }))
}

export const removalTemplate = (
  input: string,
  content: {
    postTitle?: string
    communityLink?: string
    username?: string
    reason?: string
  },
) => {
  if (content.postTitle) input = input.replaceAll('{{post}}', content.postTitle)
  if (content.communityLink) input = input.replaceAll('{{community}}', content.communityLink)
  if (content.username) input = input.replaceAll('{{username}}', content.username)
  if (content.reason) input = input.replaceAll('{{reason}}', content.reason)
  return input
}
