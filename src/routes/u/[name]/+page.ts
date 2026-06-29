import { client } from '$lib/api/client.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte.js'
import type { PostSortType } from 'lemmy-js-client'

export async function load({ params, url, fetch, route }) {
  const cursor = url.searchParams.get('cursor') || undefined
  const type: 'comments' | 'posts' | 'all' =
    (url.searchParams.get('type') as 'comments' | 'posts' | 'all') || 'all'
  const sort: PostSortType = (url.searchParams.get('sort') as PostSortType) || 'new'

  const user = await feed(
    route.id,
    async (p) => await client({ func: fetch }).getPersonDetails(p),
  ).load({
    username: params.name,
  })

  // TODO you can probably cache the posts in the feed as well
  const content = await client({ func: fetch }).listPersonContent({
    person_id: user.person_view.person.id,
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
    person_view: user.person_view,
    moderates: user.moderates,
    items: content.items,
  }
}
