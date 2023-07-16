import { authData, getClient } from '$lib/lemmy.js'
import type { CommentView, PostView } from 'lemmy-js-client'
import { get } from 'svelte/store'

function getSavedItemPublished(item: PostView | CommentView) {
  if ('comment' in item) {
    return item.comment.published
  } else {
    return item.post.published
  }
}

export async function load({ url }) {
  if (!get(authData)) return { posts: [] }
  const page = Number(url.searchParams.get('page')) || 1

  const client = getClient()

  const [posts, comments] = await Promise.all([
    client.getPosts({
      saved_only: true,
      auth: get(authData)!.token,
      limit: 20,
      page: page,
      sort: 'New',
    }),

    client.getComments({
      saved_only: true,
      auth: get(authData)!.token,
      limit: 20,
      page: page,
      sort: 'New',
    }),
  ])

  const everything = [...posts.posts, ...comments.comments].sort(
    (a, b) =>
      Date.parse(getSavedItemPublished(b)) -
      Date.parse(getSavedItemPublished(a))
  )

  return { data: everything }
}
