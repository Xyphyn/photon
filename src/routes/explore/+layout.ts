import type { CommunitySortType, ListingType } from '$lib/api/types'

export function load({ url }) {
  const sort = (url.searchParams.get('sort') as CommunitySortType) || 'active_daily'
  const cursor = url.searchParams.get('cursor') || undefined
  const query = url.searchParams.get('q') || ''

  const type = (url.searchParams.get('type') as ListingType) || 'all'

  return {
    sort: sort,
    cursor: cursor,
    query: query,
    type: type,
  }
}
