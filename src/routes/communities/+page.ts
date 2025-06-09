import { LINKED_INSTANCE_URL } from '$lib/instance.svelte.js'
import { getClient } from '$lib/lemmy.svelte.js'
import { ReactiveState } from '$lib/promise.svelte'
import { type ListingType, type SortType } from 'lemmy-js-client'

export async function load({ url, fetch }) {
  const type =
    (url.searchParams.get('type') as ListingType) ||
    (LINKED_INSTANCE_URL ? 'Local' : 'All')
  const sort = (url.searchParams.get('sort') as SortType) || 'TopDay'
  const page = Number(url.searchParams.get('page')) || 1
  const query = url.searchParams.get('q') || ''

  const communities =
    query != ''
      ? await getClient(undefined, fetch).search({
          limit: 40,
          page: page,
          sort: sort,
          type_: 'Communities',
          listing_type: type,
          q: query,
        })
      : await getClient(undefined, fetch).listCommunities({
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
