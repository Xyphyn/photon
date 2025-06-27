import { profile } from '$lib/auth.svelte'
import { isAdmin } from '$lib/components/lemmy/moderation/moderation.js'
import { getClient } from '$lib/lemmy.svelte.js'
import {
  generalizeCommentReport,
  generalizePostReport,
  generalizePrivateMessageReport,
} from '$lib/lemmy/report.js'
import { ReactiveState } from '$lib/promise.svelte'
import { error } from '@sveltejs/kit'

type ReportListType = 'unread' | 'all'

export async function load({ url, fetch }) {
  if (!profile.data.jwt) error(401)

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

  const admin = profile.data?.user ? isAdmin(profile!.data.user!) : false

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

  return {
    type: new ReactiveState(type),
    page: page,
    items: new ReactiveState(everything),
    filters: {
      community: community,
    },
  }
}
