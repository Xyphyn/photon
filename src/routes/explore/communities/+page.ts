import { client } from '$lib/api/client.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte.js'

export async function load({ fetch, parent }) {
  const { page, query, sort, type, typeInstance } = await parent()

  const feedData = await feed('/explore/communities', async (params) =>
    query != ''
      ? await client({ func: fetch, instanceURL: typeInstance }).search({
          limit: 40,
          page: params.page,
          sort: params.sort,
          type_: 'Communities',
          listing_type: params.type,
          q: params.query,
        })
      : await client({
          func: fetch,
          instanceURL: typeInstance,
        }).listCommunities({
          limit: 40,
          page: params.page,
          sort: params.sort,
          type_: params.type,
          show_nsfw: true,
        }),
  ).load({
    page,
    query,
    sort,
    type,
  })

  return {
    communities: feedData.communities,
    type: type,
    sort: sort,
    query: query,
    page: page,
  }
}
