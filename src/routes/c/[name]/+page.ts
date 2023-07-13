import { authData, getClient } from '$lib/lemmy.js'
import type { ListingType, SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load(req: any) {
  const page = Number(req.url.searchParams.get('page') || 1) || 1

  const sort: SortType =
    (req.url.searchParams.get('sort') as SortType) || 'Active'

  return {
    posts: getClient().getPosts({
      limit: 40,
      community_name: req.params.name,
      page: page,
      sort: sort,
      auth: get(authData)?.token,
    }),
    community: getClient().getCommunity({
      name: req.params.name,
    }),
  }
}
