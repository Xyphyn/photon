import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth'
import { urlParam } from '$lib/app/util/params.js'
import { error } from '@sveltejs/kit'

export async function load({ url, fetch }) {
  if (!profile.current.jwt) error(401)

  const community = urlParam.number(url, 'community')
  const unreadOnly = urlParam.bool(url, 'unreadOnly', true)
  const cursor = urlParam.optional(url, 'cursor')

  const reports = await client({ func: fetch }).listReports({
    limit: 20,
    page_cursor: cursor,
    unresolved_only: unreadOnly,
    show_community_rule_violations: true,
    type_: 'all',
    sort: 'default',
  })

  return {
    params: {
      unreadOnly: unreadOnly,
      next: reports.next_page,
      prev: reports.prev_page,
      community: community,
    },
    items: reports.items,
  }
}
