import { getClient } from '$lib/lemmy.svelte.js'

export async function load({ fetch, params }) {
  await getClient(undefined, fetch).verifyEmail({
    token: params.token,
  })
}
