import { client } from '$lib/api/client.svelte'

export async function load({ fetch }) {
  const res = await client({ func: fetch }).listTaglines({ limit: 50 })

  return {
    taglines: res.items,
  }
}
