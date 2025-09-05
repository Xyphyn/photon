import { LINKED_INSTANCE_URL } from '$lib/instance.svelte.js'
import { client } from '$lib/client/lemmy.svelte'
import { ReactiveState } from '$lib/promise.svelte'
import { type ListingType, type SortType } from '$lib/client/types'

export async function load({ url, fetch }) {
  const typeParam = url.searchParams.get('type')
  const typeInstance = typeParam?.split('instance-')[1]

  const type = typeInstance
    ? 'Local'
    : (typeParam as ListingType) || (LINKED_INSTANCE_URL ? 'Local' : 'All')

  const sort = (url.searchParams.get('sort') as SortType) || 'TopDay'
  const page = Number(url.searchParams.get('page')) || 1
  const query = url.searchParams.get('q') || ''

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
    type: typeParam ?? type,
    sort: sort,
    query: query,
    page: page,
  }
}
