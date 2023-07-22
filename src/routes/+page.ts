import { authData, getClient } from '$lib/lemmy.js'
import { userSettings } from '$lib/settings.js'
import type { ListingType, SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'

export async function load({ url }) {
  const page = Number(url.searchParams.get('page') || 1) || 1

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) ||
    get(userSettings).defaultSort.sort
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) ||
    get(userSettings).defaultSort.feed

  return {
    posts: getClient().getPosts({
      limit: 20,
      page: page,
      sort: sort,
      type_: listingType,
      auth: get(authData)?.token,
    }),
    streamed: {
      site: getClient().getSite({}),
    },
  }
}
