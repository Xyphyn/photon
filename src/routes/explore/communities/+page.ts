import { client } from '$lib/api/client.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte.js'

export async function load({ fetch, parent }) {
  const { cursor, query, sort, type } = await parent()

  const feedData = await feed(
    '/explore/communities',
    async (params) =>
      await client({
        func: fetch,
      }).listCommunities({
        limit: 40,
        page_cursor: params.cursor,
        sort: params.sort,
        type_: params.type,
        show_nsfw: true,
      }),
  ).load({
    cursor,
    query,
    sort,
    type,
  })

  return {
    communities: feedData.items,
    params: {
      type: type,
      sort: sort,
      query: query,
      next: feedData.next_page,
      prev: feedData.prev_page,
    },
  }
}
