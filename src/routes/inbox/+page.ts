import { notifications, profile } from '$lib/auth.svelte'
import { publishedToDate } from '$lib/components/util/date.js'
import { getClient } from '$lib/client/client.svelte.js'
import {
  generalizeCommentReply,
  generalizePersonMention,
  generalizePrivateMessage,
} from '$lib/lemmy/inbox.js'
import { ReactiveState } from '$lib/promise.svelte.js'

type InboxFeedType = 'replies' | 'mentions' | 'messages' | 'all'

export async function load({ url, fetch }) {
  if (!profile.data.jwt) return

  const type: InboxFeedType =
    (url.searchParams.get('type') as InboxFeedType) || 'all'
  const client = getClient(undefined, fetch)
  const page = Number(url.searchParams.get('page')) || 1
  const unreadOnly: string = url.searchParams.get('unreadOnly') || 'true'

  const params = {
    limit: 20,
    page: page,
    unread_only: unreadOnly == 'true',
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

  const totalNotifs = type == 'all' ? data.filter(i => !i.read).length : 0

  notifications.update(i => ({
    applications: i.applications,
    reports: i.reports,
    inbox: totalNotifs,
  }))

  return {
    unreadOnly: unreadOnly,
    type: type,
    page: page,
    inbox: new ReactiveState(data),
    limit: 20,
  }
}
