import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'

export async function load({ params, fetch }) {
  const comment = await getClient(undefined, fetch).getComment({
    id: Number(params.id),
  })

  throw redirect(
    300,
    `/post/${params.instance}/${comment.comment_view.post.id}?thread=${comment.comment_view.comment.path}#${comment.comment_view.comment.id}`
  )
}
