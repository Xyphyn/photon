import { client } from '$lib/api/client.svelte'
import { urlParam } from '$lib/app/util/params'
import { feed } from '$lib/feature/feeds/feed.svelte.js'
import type { MultiCommunityListingType, MultiCommunitySortType } from 'lemmy-js-client'

export async function load({ fetch, parent, route, url }) {
  const { cursor, query, period } = await parent()

  const sort = urlParam.string<MultiCommunitySortType>(url, 'sort', 'subscribers')
  const type = urlParam.string<MultiCommunityListingType>(url, 'type', 'all')

  const feedData = await feed(
    route.id,
    async (params) => await client({ func: fetch }).listMultiCommunities(params),
  ).load({
    page_cursor: cursor,
    search_term: query,
    sort,
    type_: type,
    time_range_seconds: period,
    limit: 50,
  })

  return {
    feeds: feedData.items,
    params: {
      type: type,
      sort: sort,
      query: query,
      next: feedData.next_page,
      prev: feedData.prev_page,
      period: period,
    },
  }
}
