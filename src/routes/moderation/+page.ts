import { authData, getClient } from '$lib/lemmy.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import { get } from 'svelte/store'

export async function load({ url }) {
  const page = Number(url.searchParams.get('page')) || 1
  const jwt = get(authData)?.token

  if (!jwt) return { page: page }

  // can they like
  // make a sane, consistent, and simple API for once
  // 3 separate requests? really?
  // and this time instead of get() it's list(). Why?!
  // the interfaces don't even extend each other
  // meaning I have to make a separate function to get dates
  // for EACH FREAKING ITEM KAJSHDAWLD auwdi awiody

  const client = getClient()

  const params = {
    auth: jwt,
    limit: 20,
    page: page,
  }

  const [posts, comments, messages] = await Promise.all([
    client.listPostReports({
      ...params,
    }),
    client.listCommentReports({
      ...params,
    }),
    client.listPrivateMessageReports({
      ...params,
    }),
  ])

  const everything = [
    ...posts.post_reports,
    ...comments.comment_reports,
    ...messages.private_message_reports,
  ].sort(
    (a, b) => Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a))
  )

  return {
    page: page,
    items: everything,
  }
}
