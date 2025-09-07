import { client } from '$lib/client/lemmy.svelte'
import { awaitIfServer } from '$lib/util.svelte.js'

export async function load({ fetch, url }) {
  const page = Number(url.searchParams.get('page') || '1')

  // TODO probably add proper paging
  const messagePromise = client({ func: fetch }).getPrivateMessages({
    limit: 50,
    page: page,
  })

  return {
    messages: (await awaitIfServer(messagePromise)).data,
    page: page,
  }
}
