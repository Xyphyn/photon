import { client } from '$lib/api/client.svelte'
import type { PersonView, PostSortType } from '$lib/api/types'

export async function load({ url, fetch, parent }) {
  const cursor = url.searchParams.get('cursor') || undefined
  const type: 'comments' | 'posts' | 'all' =
    (url.searchParams.get('type') as 'comments' | 'posts' | 'all') || 'all'
  const sort: PostSortType = (url.searchParams.get('sort') as PostSortType) || 'new'

  const user = await parent()

  // TODO you can probably cache the posts in the feed as well
  const content = await client({ func: fetch }).listPersonContent({
    person_id: user.local_user_view.person.id,
    limit: 20,
    type_: type,
    page_cursor: cursor,
  })

  return {
    params: {
      type: type,
      sort: sort,
      limit: 20,
      next: content.next_page,
      prev: content.prev_page,
    },
    person_view: {
      ...user.local_user_view,
      is_admin: user.local_user_view.local_user.admin,
    } as PersonView,
    moderates: user.moderates,
    items: content.items,
  }
}
