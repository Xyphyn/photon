import type { ListingType, SortType } from '$lib/api/types'
import { LINKED_INSTANCE_URL } from '$lib/app/instance.svelte'

export function load({ url }) {
  const sort = (url.searchParams.get('sort') as SortType) || 'TopDay'
  const page = Number(url.searchParams.get('page')) || 1
  const query = url.searchParams.get('q') || ''

  const typeParam = url.searchParams.get('type')
  const typeInstance = typeParam?.split('instance-')[1]

  const type = (
    typeInstance
      ? 'Local'
      : typeParam || (LINKED_INSTANCE_URL ? 'Local' : 'All')
  ) as ListingType

  return {
    sort: sort,
    page: page,
    query: query,
    type: type,
    typeInstance: typeInstance,
  }
}
