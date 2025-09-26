import { client } from '$lib/api/client.svelte'
import type { SortType } from '$lib/api/types'
import { settings } from '$lib/app/settings.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte'
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

    const posts = await piefed.getPosts(p)

    return {
      ...posts,
      topic: piefedTopicData,
      params: { ...p, page_cursor: posts.next_page },
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
