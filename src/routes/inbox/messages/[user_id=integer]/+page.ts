import { client } from '$lib/api/client.svelte'

export async function load({ fetch, params }) {
  const creator = Number(params.user_id)
  const LIMIT = 50

  const userPromise = client({ func: fetch }).getPersonDetails({
    person_id: creator,
  })

  const messagePromise = client({ func: fetch }).listNotifications({
    creator_id: Number(params.user_id),
    limit: LIMIT,
    type_: 'private_message',
  })

  const [message, user] = await Promise.all([messagePromise, userPromise])

  return {
    messages: message,
    creator: user,
    limit: LIMIT,
  }
}
