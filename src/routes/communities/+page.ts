import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import type { ListingType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ url, fetch }) {
  const type = url.searchParams.get('type') as ListingType
  const page = Number(url.searchParams.get('page')) || 1
  const query = url.searchParams.get('q')

  if (query) {
    return await getClient(undefined, fetch).search({
      limit: 40,
      page: page,
      sort: 'TopAll',
      type_: 'Communities',
      listing_type: type,
      q: query,
      auth: get(profile)?.jwt,
    })
  } else {
    return await getClient(undefined, fetch).listCommunities({
      limit: 40,
      page: page,
      sort: 'TopAll',
      type_: type,
      auth: get(profile)?.jwt,
    })
  }
}
