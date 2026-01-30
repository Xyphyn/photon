import type { PostView } from '$lib/api/types'
import { settings } from '$lib/app/settings.svelte'

type FilterAction = 'none' | 'minimize' | 'hide'
type FilterType = 'keyword'

export interface Filter {
  match: string
  action: FilterAction
  type: FilterType
}

type FilterEx = Filter & { regex: RegExp }

export type FilteredItem = { id: number; action: FilterAction }

// ban me from regex brother
const filtersEx: FilterEx[] = $derived(
  settings.filters.map((filter) => ({
    ...filter,
    regex: new RegExp(filter.match, 'i'),
  })),
)

export function filterPost(
  post: PostView,
  filters: FilterEx[] = filtersEx,
): FilterAction {
  for (const filter of filters) {
    try {
      if (
        filter.regex.test(post.post.url ?? '') ||
        filter.regex.test(post.post.name) ||
        filter.regex.test(post.post.body ?? '')
      )
        return filter.action
    } catch {
      /* */
    }
  }
  return 'none'
}
