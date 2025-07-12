import { resolveRoute } from '$app/paths'
import { profile } from '$lib/auth.svelte.js'
import { client } from '$lib/lemmy.svelte.js'
import { redirect } from '@sveltejs/kit'

export async function load({ params, fetch }) {
  if (profile.current.instance != params.instance)
    redirect(302, resolveRoute('/comment/[instance]/[id]/confirm', params))

  const comment = await client({
    instanceURL: profile.current.instance,
    func: fetch,
  }).getComment({
    id: Number(params.id),
  })

  redirect(
    302,
    `/post/${profile.current.instance}/${comment.comment_view.post.id}?thread=${comment.comment_view.comment.path}#${comment.comment_view.comment.id}`,
  )
}
