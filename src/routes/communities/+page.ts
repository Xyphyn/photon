import { authData, getClient } from '$lib/lemmy.js'
import type { ListingType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ url }) {
  const type = url.searchParams.get('type') as ListingType
  const page = Number(url.searchParams.get('page')) || 1
  const query = url.searchParams.get('q')

  if (query) {
    return await getClient().search({
      limit: 40,
      page: page,
      sort: 'TopAll',
      type_: 'Communities',
      listing_type: type,
      q: query,
      auth: get(authData)?.token,
    })
  } else {
    return await getClient().listCommunities({
      limit: 40,
      page: page,
      sort: 'TopAll',
      type_: type,
      auth: get(authData)?.token,
    })
  }
}
