import { getClient } from '$lib/client/client.svelte.js'

export async function load({ fetch, params }) {
  await getClient(undefined, fetch).verifyEmail({
    token: params.token,
  })
}
