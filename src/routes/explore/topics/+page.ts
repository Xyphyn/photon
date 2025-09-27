import { client } from '$lib/api/client.svelte'
import { ReactiveState } from '$lib/app/util.svelte'
import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
  const piefed = client({ func: fetch })

  if (!piefed.getTopics) error(404, 'unsupported')

  const topics = await piefed.getTopics({ include_communities: false })

  return {
    topics: new ReactiveState(topics.topics),
  }
}
