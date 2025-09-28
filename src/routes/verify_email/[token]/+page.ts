import { client } from '$lib/api/client.svelte'

export async function load({ fetch, params }) {
  await client({ func: fetch }).verifyEmail({
    token: params.token,
  })
}
