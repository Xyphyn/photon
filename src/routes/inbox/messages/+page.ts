import { client } from '$lib/lemmy.svelte.js'
import { awaitIfServer } from '$lib/promise.svelte.js'

export async function load({ fetch }) {
  // TODO probably add proper paging
  const messagePromise = client({ func: fetch }).getPrivateMessages({
    limit: 50,
  })

  return {
    messages: (await awaitIfServer(messagePromise)).data,
  }
}
