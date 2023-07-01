import { lemmy } from '$lib/lemmy.js'
import type { ListingType, SortType } from 'lemmy-js-client'

export function load(req) {
  const page = Number(req.url.searchParams.get('page') || 1) || 1

  const sort: SortType =
    (req.url.searchParams.get('sort') as SortType) || 'Active'
  const listingType: ListingType =
    (req.url.searchParams.get('type') as ListingType) || 'Local'

  return lemmy.getPosts({
    limit: 40,
    page: page,
    sort: sort,
    type_: listingType,
  })
}
