import { profile } from '$lib/auth.svelte'
import { client } from '$lib/lemmy.svelte.js'
import { error } from '@sveltejs/kit'
import type { CommentView, PostView } from 'lemmy-js-client'

function getSavedItemPublished(item: PostView | CommentView) {
  if ('comment' in item) {
    return item.comment.published
  } else {
    return item.post.published
  }
}

export async function load({ url, fetch }) {
  if (!profile.current.jwt) throw error(401)

  const user =
    profile.current.user ?? (await client({ func: fetch }).getSite()).my_user

  if (!user) throw error(401)

  const page = Number(url.searchParams.get('page')) || 1
  const type: 'comments' | 'posts' | 'all' =
    (url.searchParams.get('type') as 'comments' | 'posts' | 'all') || 'all'

  const { posts, comments } = await client({ func: fetch }).getPersonDetails({
    saved_only: true,
    limit: 20,
    page: page,
    person_id: user?.local_user_view.person.id,
  })

  const everything = [
    ...(type == 'posts' || type == 'all' ? posts : []),
    ...(type == 'comments' || type == 'all' ? comments : []),
  ].sort(
    (a, b) =>
      Date.parse(getSavedItemPublished(b)) -
      Date.parse(getSavedItemPublished(a)),
  )

  return { page: page, data: everything, type: type }
}
