import { client } from '$lib/client/lemmy.svelte'

export async function load({ fetch }) {
  const response = await client({ func: fetch }).listLogins()

  return {
    tokens: response,
  }
}
