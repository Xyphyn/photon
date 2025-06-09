import { getClient } from '$lib/lemmy.svelte.js'
import { getItemPublished } from '$lib/lemmy/item.js'
import { ReactiveState } from '$lib/promise.svelte.js'
import type { CommentView, PostView, SortType } from 'lemmy-js-client'

export async function load({ params, url, fetch }) {
  const page = Number(url.searchParams.get('page')) || 1
  const type: 'comments' | 'posts' =
    (url.searchParams.get('type') as 'comments' | 'posts') || 'posts'
  const sort: SortType = (url.searchParams.get('sort') as SortType) || 'New'

  console.log(type)

  const user = await getClient(undefined, fetch).getPersonDetails({
    limit: 20,
    page: page,
    username: params.name,
    sort: sort,
  })

  const items: (PostView | CommentView)[] =
    type == 'posts' ? user.posts : user.comments

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
