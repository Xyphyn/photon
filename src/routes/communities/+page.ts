import { profile } from '$lib/auth.js'
import { LINKED_INSTANCE_URL } from '$lib/instance.js'
import { getClient } from '$lib/lemmy.js'
import type { ListingType, SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ url, fetch }) {
  const type =
    (url.searchParams.get('type') as ListingType) ||
    (LINKED_INSTANCE_URL ? 'Local' : 'All')
  const sort = (url.searchParams.get('sort') as SortType) || 'TopAll'
  const page = Number(url.searchParams.get('page')) || 1
  const query = url.searchParams.get('q')

  if (query) {
    return {
      ...(await getClient(undefined, fetch).search({
        limit: 40,
        page: page,
        sort: sort,
        type_: 'Communities',
        listing_type: type,
        q: query,
        auth: get(profile)?.jwt,
      })),
      type: type,
      sort: sort,
      query: query,
      page: page,
    }
  } else {
    return {
      ...(await getClient(undefined, fetch).listCommunities({
        limit: 40,
        page: page,
        sort: sort,
        type_: type,
        auth: get(profile)?.jwt,
      })),
      type: type,
      sort: sort,
      query: query,
      page: page,
    }
  }
}
