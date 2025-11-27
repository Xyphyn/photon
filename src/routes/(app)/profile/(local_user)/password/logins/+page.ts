import { client } from '$lib/api/client.svelte'

export async function load({ fetch }) {
  const response = await client({ func: fetch }).listLogins()

  return {
    tokens: response,
  }
}
