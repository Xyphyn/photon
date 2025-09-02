import { profile } from '$lib/auth.svelte'
import { isAdmin } from '$lib/components/lemmy/moderation/moderation.js'
import { getClient } from '$lib/client/lemmy.svelte'
import { isCommentView, isPostView } from '$lib/lemmy/item'
import {
  generalizeCommentReport,
  generalizePostReport,
  generalizePrivateMessageReport,
  type ReportView,
} from '$lib/lemmy/report.js'
import { ReactiveState } from '$lib/promise.svelte'
import { error } from '@sveltejs/kit'

type ReportListType = 'unread' | 'all'

export async function load({ url, fetch }) {
  if (!profile.current.jwt) error(401)

  const page = Number(url.searchParams.get('page')) || 1
  const type: ReportListType =
    (url.searchParams.get('type') as ReportListType) || 'unread'
  const community = Number(url.searchParams.get('community')) || undefined

  const client = getClient(undefined, fetch)

  const params = {
    limit: 20,
    page: page,
    unresolved_only: type == 'unread',
    community_id: community,
  }

  const admin = profile.current?.user ? isAdmin(profile!.current.user!) : false

  const [posts, comments, messages] = await Promise.all([
    client.listPostReports({
      ...params,
    }),
    client.listCommentReports({
      ...params,
    }),
    admin ? client.listPrivateMessageReports({ ...params }) : undefined,
  ])

  const everything = [
    ...posts.post_reports.map(generalizePostReport),
    ...comments.comment_reports.map(generalizeCommentReport),
    ...(messages?.private_message_reports ?? []).map(
      generalizePrivateMessageReport,
    ),
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  const grouped = everything.reduce(
    (groups, item) => {
      const key = isPostView(item.item)
        ? item.item.post.id
        : isCommentView(item.item)
          ? item.item.comment.id
          : item.item.id
      if (!groups[key]) {
        groups[key] = []
      }
      groups[key].push(item)
      return groups
    },
    {} as Record<number, ReportView[]>,
  )

  return {
    type: new ReactiveState(type),
    page: page,
    items: new ReactiveState(Object.values(grouped)),
    filters: {
      community: community,
    },
  }
}
