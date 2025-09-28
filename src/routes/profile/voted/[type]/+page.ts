import { client } from '$lib/api/client.svelte'
import { ReactiveState } from '$lib/app/util.svelte'
import { getItemPublished } from '$lib/feature/legacy/item'
import { error } from '@sveltejs/kit'

export async function load({ url, params }) {
  if (params.type.toLowerCase() != 'up' && params.type.toLowerCase() != 'down')
    error(404)

  const page = Number(url.searchParams.get('page')) || 1

  const upvoted = params.type == 'up'

  const data = await Promise.all([
    client().getPosts({
      liked_only: upvoted,
      disliked_only: !upvoted,
      page: page,
      sort: 'New',
      type_: 'All',
      limit: 20,
    }),
    client().getComments({
      liked_only: upvoted,
      disliked_only: !upvoted,
      page: page,
      sort: 'New',
      type_: 'All',
      limit: 20,
    }),
  ])

  const everything = [...data[0].posts, ...data[1].comments].sort(
    (a, b) => Date.parse(getItemPublished(b)) - Date.parse(getItemPublished(a)),
  )

  return {
    items: everything,
    upvoted: upvoted,
    filters: new ReactiveState({
      page: page,
    }),
  }
}
