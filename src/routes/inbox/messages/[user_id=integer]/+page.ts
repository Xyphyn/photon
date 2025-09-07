import { client } from '$lib/client/lemmy.svelte'
import { ReactiveState } from '$lib/util.svelte.js'

export async function load({ fetch, params }) {
  const creator = Number(params.user_id)

  const userPromise = client({ func: fetch }).getPersonDetails({
    person_id: creator,
    limit: 1,
  })

  const messagePromise = client({ func: fetch }).getPrivateMessages({
    creator_id: Number(params.user_id),
    limit: 50,
    page: 1,
  })

  const [message, user] = await Promise.all([messagePromise, userPromise])

  return {
    message: new ReactiveState(message),
    creator: new ReactiveState(user),
  }
}
