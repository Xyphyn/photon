import { client } from '$lib/api/client.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte.js'

export async function load({ fetch, parent }) {
  const { cursor, query, sort, type, period } = await parent()

  const feedData = await feed(
    '/explore/communities',
    async (params) => await client({ func: fetch }).listCommunities(params),
  ).load({
    page_cursor: cursor,
    search_term: query,
    sort,
    type_: type,
    time_range_seconds: period,
    limit: 50,
  })

  return {
    communities: feedData.items,
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
