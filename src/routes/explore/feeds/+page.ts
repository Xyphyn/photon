import { client } from '$lib/client/lemmy.svelte.js'
import { ReactiveState } from '$lib/util.svelte'
import { error } from '@sveltejs/kit'

export async function load({ fetch }) {
  const piefed = client({ func: fetch })

  if (!piefed.getFeeds) error(404, 'unsupported')

  const feeds = await piefed.getFeeds({ include_communities: false })

  return {
    feeds: new ReactiveState(feeds.feeds),
  }
}
