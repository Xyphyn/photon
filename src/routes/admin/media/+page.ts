import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth.svelte'
import { ReactiveState } from '$lib/app/util.svelte'

export async function load({ fetch, url }) {
  const { jwt } = profile.current

  const page = Number(url.searchParams.get('page')) || 1

  const res = await client({ func: fetch, auth: jwt }).listAllMedia({
    limit: 20,
    page: page,
  })

  return { images: new ReactiveState(res.images) }
}
