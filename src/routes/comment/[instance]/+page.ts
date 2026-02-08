import { resolve } from '$app/paths'
import { instance } from '$lib/app/instance.svelte'
import { redirect } from '@sveltejs/kit'

export function load({ params }) {
  // If you somehow got to /comment/instance, it likely means you passed in an ID, not an instance.
  redirect(
    302,
    resolve('/comment/[instance]/[id]', {
      instance: encodeURIComponent(instance.data.toLowerCase()),
      id: params.instance,
    }),
  )
}
