import { authData, getClient } from '$lib/lemmy.js'
import { getInboxItemPublished } from '$lib/lemmy/inbox.js'
import { get } from 'svelte/store'

export async function load({ url }) {
  const auth = get(authData)
  if (!auth) return

  const client = getClient()

  const page = Number(url.searchParams.get('page')) || 1

  const params = {
    limit: 50,
    page: page,
    auth: auth.token,
  }

  const [replies, mentions, privateMessages] = await Promise.all([
    client.getReplies({
      ...params,
      sort: 'New',
    }),
    client.getPersonMentions({
      ...params,
      sort: 'New',
    }),
    client.getPrivateMessages(params),
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

  return { page: page, data: data }
}
