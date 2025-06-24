import { client } from '$lib/client/client.svelte.js'

export async function load({ fetch }) {
  const response = await client({ func: fetch }).listLogins()

  return {
    tokens: response,
  }
}
