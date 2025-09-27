import { client } from '$lib/api/client.svelte'
import { ReactiveState } from '$lib/app/util.svelte'
import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
  const piefed = client({ func: fetch })

  if (!piefed.getFeeds) error(404, 'unsupported')

  const feeds = await piefed.getFeeds({ include_communities: false })

  return {
    feeds: new ReactiveState(feeds.feeds),
  }
}
