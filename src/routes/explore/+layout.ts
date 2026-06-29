import { type CommunitySortType, type ListingType } from '$lib/api/types'
import { urlParam } from '$lib/app/util/params.js'

export function load({ url }) {
  const sort = urlParam.string<CommunitySortType>(url, 'sort', 'active_daily')
  const cursor = urlParam.optional(url, 'cursor')
  const query = urlParam.string(url, 'q', '')
  const period = urlParam.number(url, 'period')
  const type = urlParam.string<ListingType>(url, 'type', 'all')

  return { sort, cursor, query, type, period }
}
