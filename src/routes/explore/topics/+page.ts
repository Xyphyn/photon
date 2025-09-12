import { client } from '$lib/client/lemmy.svelte.js'
import { ReactiveState } from '$lib/util.svelte'
import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
  const piefed = client({ func: fetch })

  if (!piefed.getTopics) error(404, 'unsupported')

  const topics = await piefed.getTopics({ include_communities: false })

  return {
    topics: new ReactiveState(topics.topics),
  }
}
