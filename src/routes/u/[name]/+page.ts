import { isComment } from '$lib/components/lemmy/post/helpers.js'
import { authData, getClient } from '$lib/lemmy.js'
import type { CommentView, PostView } from 'lemmy-js-client'
import { get } from 'svelte/store'

function getDateOfItem(item: CommentView | PostView): number {
  if (isComment(item)) {
    return Date.parse(item.comment.published)
  } else {
    return Date.parse(item.post.published)
  }
}

export async function load({ params, url }) {
  const page = Number(url.searchParams.get('page')) || 1
  const type: 'comments' | 'posts' | 'all' =
    (url.searchParams.get('type') as 'comments' | 'posts' | 'all') || 'all'

  const user = await getClient().getPersonDetails({
    limit: 20,
    page: page,
    username: params.name,
    sort: 'New',
    auth: get(authData)?.token,
  })

  return {
    type: type,
    page: page,
    person_view: user.person_view,
    items: [...user.posts, ...user.comments].sort(
      (a, b) => getDateOfItem(b) - getDateOfItem(a)
    ),
  }
}
