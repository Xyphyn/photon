import { notifications, profile } from '$lib/auth.svelte'
import { publishedToDate } from '$lib/components/util/date.js'
import { getClient } from '$lib/client/lemmy.svelte'
import {
  generalizeCommentReply,
  generalizePersonMention,
  generalizePrivateMessage,
} from '$lib/lemmy/inbox.js'
import { ReactiveState } from '$lib/util.svelte.js'
import { error } from '@sveltejs/kit'

type InboxFeedType = 'replies' | 'mentions' | 'messages' | 'all'

export async function load({ url, fetch }) {
  if (!profile.current.jwt) error(401)

  const type: InboxFeedType =
    (url.searchParams.get('type') as InboxFeedType) || 'all'
  const client = getClient(undefined, fetch)
  const page = Number(url.searchParams.get('page')) || 1
  const unreadOnly: boolean =
    (url.searchParams.get('unreadOnly') || 'true') == 'true'

  const params = {
    limit: 20,
    page: page,
    unread_only: unreadOnly,
  }

  const [replies, mentions, privateMessages] = await Promise.all([
    type == 'all' || type == 'replies'
      ? client.getReplies({
          ...params,
          sort: 'New',
        })
      : { replies: [] },
    type == 'all' || type == 'mentions'
      ? client.getPersonMentions({
          ...params,
          sort: 'New',
        })
      : {
          mentions: [],
        },
    type == 'all' || type == 'messages'
      ? client.getPrivateMessages({ ...params })
      : {
          private_messages: [],
        },
  ])

  const data = [
    ...replies.replies.map(generalizeCommentReply),
    ...mentions.mentions.map(generalizePersonMention),
    ...privateMessages.private_messages.map(generalizePrivateMessage),
  ].sort(
    (a, b) =>
      publishedToDate(b.published).getTime() -
      publishedToDate(a.published).getTime(),
  )

  const totalNotifs =
    type == 'all'
      ? data.filter((i) => i.type != 'private_message' && !i.read).length
      : 0

  notifications.update((i) => ({
    applications: i.applications,
    reports: i.reports,
    inbox: totalNotifs,
  }))

  return {
    unreadOnly: new ReactiveState(unreadOnly),
    type: type,
    page: page,
    inbox: new ReactiveState(data),
    limit: 20,
  }
}
