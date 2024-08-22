import { client } from '$lib/lemmy.js'
import { awaitIfServer } from '$lib/promise.js'

export async function load({ fetch, params }) {
  return {
    message: await client().getPrivateMessages({
      creator_id: Number(params.user_id),
      limit: 50,
      page: 1,
    }),
    creator: Number(params.user_id),
  }
}
