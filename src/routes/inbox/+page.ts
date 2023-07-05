import { authData, getClient } from '$lib/lemmy.js'
import { getInboxItemPublished } from '$lib/lemmy/inbox.js'
import { get } from 'svelte/store'

export async function load() {
  const auth = get(authData)
  if (!auth) return

  const client = getClient()

  const params = {
    limit: 50,
    page: 1,
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

  const data = [...replies.replies, ...mentions.mentions].sort(
    (a, b) =>
      Date.parse(getInboxItemPublished(b)) -
      Date.parse(getInboxItemPublished(a))
  )

  return { data: data }
}
