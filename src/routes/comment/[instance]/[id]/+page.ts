import { resolveRoute } from '$app/paths'
import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth.svelte'
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

  const split = comment.comment_view.comment.path.split('.')

  const threadPath = split.slice(-2).join('.')

  redirect(
    302,
    resolveRoute(
      `/post/[instance]/[id]?thread=${threadPath}#${comment.comment_view.comment.id}`,
      {
        instance: params.instance,
        id: comment.comment_view.post.id.toString(),
      },
    ),
  )
}
