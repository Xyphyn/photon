import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import { get } from 'svelte/store'

type ReportListType = 'unread' | 'all'
type ReportFilter = 'all' | 'posts' | 'comments' | 'messages'

export async function load({ url }) {
  const page = Number(url.searchParams.get('page')) || 1
  const type: ReportListType =
    (url.searchParams.get('type') as ReportListType) || 'unread'
  const filter: ReportFilter =
    (url.searchParams.get('filter') as ReportFilter) || 'all'

  const jwt = get(profile)?.jwt

  if (!jwt) return { type: type, page: page }

  // can they please
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
    unresolved_only: type == 'unread',
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
    type: type,
    page: page,
    items: everything,
  }
}
