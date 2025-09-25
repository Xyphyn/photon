import { resolveRoute } from '$app/paths'
import { profile } from '$lib/app/auth.svelte.js'
import { error, redirect } from '@sveltejs/kit'

export function load({ params }) {
  if (Number(params.instance)) {
    redirect(
      302,
      resolveRoute(`/post/[instance]/[id]`, {
        instance: profile.current.instance.toLowerCase(),
        id: params.instance,
      }),
    )
  }

  error(404)
}
