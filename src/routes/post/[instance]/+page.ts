import { resolve } from '$app/paths'
import { profile } from '$lib/app/auth'
import { error, redirect } from '@sveltejs/kit'

export function load({ params }) {
  if (Number(params.instance)) {
    redirect(
      302,
      resolve(`/post/[instance]/[id=integer]`, {
        instance: encodeURIComponent(profile.current.instance.toLowerCase()),
        id: params.instance,
      }),
    )
  }

  error(404)
}
