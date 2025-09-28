import { client } from '$lib/api/client.svelte'
import { ReactiveState } from '$lib/app/util.svelte'

export async function load({ fetch, parent }) {
  const { page, query, sort, type, typeInstance } = await parent()

  const communities =
    query != ''
      ? await client({ func: fetch, instanceURL: typeInstance }).search({
          limit: 40,
          page: page,
          sort: sort,
          type_: 'Communities',
          listing_type: type,
          q: query,
        })
      : await client({
          func: fetch,
          instanceURL: typeInstance,
        }).listCommunities({
          limit: 40,
          page: page,
          sort: sort,
          type_: type,
          show_nsfw: true,
        })

  return {
    communities: new ReactiveState(communities.communities),
    type: type,
    sort: sort,
    query: query,
    page: page,
  }
}
