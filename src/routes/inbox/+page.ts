import { authData, getClient } from '$lib/lemmy.js'
import { getInboxItemPublished } from '$lib/lemmy/inbox.js'
import { get } from 'svelte/store'

type InboxFeedType = 'replies' | 'mentions' | 'messages' | 'all'

export async function load({ url }) {
  const auth = get(authData)
  if (!auth) return

  const type: InboxFeedType =
    (url.searchParams.get('type') as InboxFeedType) || 'all'
  const client = getClient()
  const page = Number(url.searchParams.get('page')) || 1

  const params = {
    limit: 50,
    page: page,
    auth: auth.token,
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
    ...replies.replies,
    ...mentions.mentions,
    ...privateMessages.private_messages,
  ].sort(
    (a, b) =>
      Date.parse(getInboxItemPublished(b)) -
      Date.parse(getInboxItemPublished(a))
  )

  return { type: type, page: page, data: data }
}
