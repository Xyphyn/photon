import { lemmy } from '$lib/lemmy.js'
import type { ListingType } from 'lemmy-js-client'

export function load(req) {
  const type = req.url.searchParams.get('listingType') as ListingType
  const page = Number(req.url.searchParams.get('page')) || 1
  const query = req.url.searchParams.get('q')

  if (query) {
    return lemmy.search({
      limit: 40,
      page: page,
      sort: 'Active',
      type_: 'Communities',
      listing_type: type,
      q: query,
    })
  } else {
    return lemmy.listCommunities({
      limit: 40,
      page: page,
      sort: 'Active',
      type_: type,
    })
  }
}
