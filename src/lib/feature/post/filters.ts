import type { PostView } from '$lib/api/types'

type FilterAction = 'none' | 'minimize' | 'hide'
type FilterType = 'keyword'
// since we can test regexes on URLs, why not unify them?

export interface Filter {
  match: string
  action: FilterAction
  type: FilterType
}

export type FilteredItem = { id: number; action: FilterAction }

export function filterPost(post: PostView, filters: Filter[]): FilterAction {
  for (const filter of filters) {
    try {
      const regex = new RegExp(filter.match, 'i')
      if (
        regex.test(post.post.url ?? '') ||
        regex.test(post.post.name) ||
        regex.test(post.post.body ?? '')
      )
        return filter.action
    } catch {
      /* */
    }
  }
  return 'none'
}
