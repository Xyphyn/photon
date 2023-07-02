import { getClient } from '$lib/lemmy.js'
import type { ListingType, SortType } from 'lemmy-js-client'

export function load({ url, cookies }) {
  const page = Number(url.searchParams.get('page') || 1) || 1

  const sort: SortType = (url.searchParams.get('sort') as SortType) || 'Active'
  const listingType: ListingType =
    (url.searchParams.get('type') as ListingType) || 'Local'

  return {
    posts: getClient(cookies.get('instance_url')).getPosts({
      limit: 40,
      page: page,
      sort: sort,
      type_: listingType,
    }),
    site: getClient(cookies.get('instance_url')).getSite({}),
  }
}
