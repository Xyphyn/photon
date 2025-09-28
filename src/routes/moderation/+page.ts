import { getClient } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth.svelte'
import { ReactiveState } from '$lib/app/util.svelte'
import { isCommentView, isPostView } from '$lib/feature/legacy/item'
import {
  generalizeCommentReport,
  generalizePostReport,
  generalizePrivateMessageReport,
  type ReportView,
} from '$lib/feature/moderation/report'
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

  const admin = profile.isAdmin

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
