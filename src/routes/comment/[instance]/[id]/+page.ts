import { resolve } from '$app/paths'
import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth'
import { redirect } from '@sveltejs/kit'

export async function load({ params, fetch }) {
  if (profile.current.instance != params.instance)
    redirect(302, resolve('/comment/[instance]/[id]/confirm', params))

  const comment = await client({
    instanceURL: profile.current.instance,
    func: fetch,
  }).getComment({
    id: Number(params.id),
  })

  const split = comment.comment_view.comment.path.split('.')

  const threadPath = split.slice(-3).join('.')

  redirect(
    302,
    resolve('/post/[instance]/[id=integer]', {
      instance: encodeURIComponent(params.instance),
      id: comment.comment_view.post.id.toString(),
    }) + `?thread=${threadPath}#${comment.comment_view.comment.id}`,
  )
}
