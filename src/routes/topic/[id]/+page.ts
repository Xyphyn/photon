import { client } from '$lib/client/lemmy.svelte.js'
import type { SortType } from '$lib/client/types'
import { feed } from '$lib/lemmy/feeds/feed.svelte.js'
import { settings } from '$lib/settings.svelte.js'
import { error } from '@sveltejs/kit'

export async function load({ url, fetch, route, params }) {
  const piefed = client({ func: fetch })

  if (!piefed.getTopics) error(404, 'unsupported')

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort

  const cursor = url.searchParams.get('cursor') as string | undefined

  const feedData = await feed(route.id, async (p) => {
    const piefedTopicData = piefed.getTopics!({
      include_communities: true,
    }).then((i) => i.topics.find((j) => j.id.toString() == p.topic_id!))

    return {
      ...(await piefed.getPosts(p)),
      topic: piefedTopicData,
      params: p,
      client: {},
    }
  }).load({
    page_cursor: cursor,
    sort: sort,
    type_: 'All',
    limit: 20,
    show_hidden: settings.posts.showHidden,
    topic_id: params.id,
  })

  return feedData
}
