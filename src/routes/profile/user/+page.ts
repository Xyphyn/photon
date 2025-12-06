import { client } from '$lib/api/client.svelte'
import type { SortType } from '$lib/api/types'
import { feed } from '$lib/feature/feeds/feed.svelte.js'
import { getItemPublished } from '$lib/feature/legacy/item'

export async function load({ url, fetch, parent, route }) {
  const page = Number(url.searchParams.get('page')) || 1
  const type: 'comments' | 'posts' | 'all' =
    (url.searchParams.get('type') as 'comments' | 'posts' | 'all') || 'all'
  const sort: SortType = (url.searchParams.get('sort') as SortType) || 'New'

  const myUser = await parent()
  const feedData = await feed(route.id, (params) =>
    client({ func: fetch }).getPersonDetails({
      limit: params.limit,
      page: params.page,
      person_id: myUser?.my_user?.local_user_view.person.id,
      sort: params.sort,
    }),
  ).load({
    limit: 20,
    page: page,
    person_id: myUser.my_user?.local_user_view.person.id,
    sort: sort,
  })

  const items = [
    ...(type == 'all' || type == 'posts' ? feedData.posts : []),
    ...(type == 'all' || type == 'comments' ? feedData.comments : []),
  ]

  if (sort == 'TopAll') {
    items.sort(
      (a, b) =>
        b.counts.upvotes -
        b.counts.downvotes -
        (a.counts.upvotes - a.counts.downvotes),
    )
  } else if (sort == 'New') {
    items.sort(
      (a, b) =>
        Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a)),
    )
  }

  return {
    type: type,
    page: page,
    sort: sort,
    limit: 20,
    user: {
      submissions: items,
      moderates: feedData.moderates,
      person_view: feedData.person_view,
    },
  }
}
