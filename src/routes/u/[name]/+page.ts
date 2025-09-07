import { client } from '$lib/client/lemmy.svelte'
import { getItemPublished } from '$lib/lemmy/item.js'
import { ReactiveState } from '$lib/util.svelte.js'
import type { SortType } from '$lib/client/types'

export async function load({ params, url, fetch }) {
  const page = Number(url.searchParams.get('page')) || 1
  const type: 'comments' | 'posts' | 'all' =
    (url.searchParams.get('type') as 'comments' | 'posts' | 'all') || 'all'
  const sort: SortType = (url.searchParams.get('sort') as SortType) || 'New'

  const user = await client({ func: fetch }).getPersonDetails({
    limit: 20,
    page: page,
    username: params.name,
    sort: sort,
  })

  const items = [...user.posts, ...user.comments]

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
    filters: new ReactiveState({
      type: type,
      page: page,
      sort: sort,
    }),
    person_view: new ReactiveState(user.person_view),
    moderates: new ReactiveState(user.moderates),
    items: new ReactiveState(items),
  }
}
