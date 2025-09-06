import { getClient } from '$lib/client/lemmy.svelte'

export async function load({ fetch, params }) {
  await getClient(undefined, fetch).verifyEmail({
    token: params.token,
  })
}
