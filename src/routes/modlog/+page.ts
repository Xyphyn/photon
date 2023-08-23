import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import type {
  Community,
  ModBanFromCommunityView,
  ModRemoveCommentView,
  ModRemovePostView,
  Person,
} from 'lemmy-js-client'
import { get } from 'svelte/store'

type ModAction =
  | ModBanFromCommunityView
  | ModRemoveCommentView
  | ModRemovePostView

export interface ModLog {
  reason?: string
  moderatee?: Person
  content?: string
  moderator?: Person
  community?: Community
  actionName: string
  timestamp: number
  link?: string
}

const fullUserName = (user: Person) =>
  `${user.name}@${new URL(user.actor_id).hostname}`

export const _toModLog = (item: ModAction): ModLog => {
  if ('mod_ban_from_community' in item) {
    return {
      moderator: item.moderator,
      moderatee: item.banned_person,
      community: item.community,
      actionName: 'ban',
      reason: item.mod_ban_from_community.reason,
      timestamp: Date.parse(`${item.mod_ban_from_community.when_}Z`),
    }
  } else if ('mod_remove_comment' in item) {
    return {
      actionName: 'commentRemoval',
      community: item.community,
      content: item.comment.content,
      timestamp: Date.parse(`${item.mod_remove_comment.when_}Z`),
      moderatee: item.commenter,
      moderator: item.moderator,
      reason: item.mod_remove_comment.reason,
      link: `/comment/${item.comment.id}`,
    }
  } else if ('mod_remove_post' in item) {
    return {
      actionName: 'postRemoval',
      community: item.community,
      content: item.post.name,
      timestamp: Date.parse(`${item.mod_remove_post.when_}Z`),
      moderator: item.moderator,
      reason: item.mod_remove_post.reason,
      link: `/post/${item.post.id}`,
    }
  }

  return {
    actionName: 'Unknown',
    timestamp: 0,
  }
}

export async function load({ url }) {
  let community = Number(url.searchParams.get('community')) || undefined
  let modId = Number(url.searchParams.get('mod_id')) || undefined
  const page = Number(url.searchParams.get('page')) || 1

  const results = await getClient().getModlog({
    auth: get(profile)?.jwt,
    community_id: community,
    limit: 40,
    type_: 'All',
    page: page,
    mod_person_id: modId,
  })

  const moderation = [
    ...results.banned_from_community,
    ...results.removed_comments,
    ...results.removed_posts,
  ]

  const moderationActions = moderation
    .map(_toModLog)
    .sort((a, b) => b.timestamp - a.timestamp)

  return {
    page: page,
    modlog: moderationActions,
  }
}
