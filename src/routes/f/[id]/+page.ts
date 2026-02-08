import { client } from '$lib/api/client.svelte'
import type { SortType } from '$lib/api/types'
import { settings } from '$lib/app/settings.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte'
import { error } from '@sveltejs/kit'

export async function load({ url, fetch, route, params }) {
  const piefed = client({ func: fetch })

  if (!piefed.getFeeds) error(404, 'unsupported')

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort

  const cursor = url.searchParams.get('cursor') as string | undefined

  const feedData = await feed(route.id, async (p) => {
    const piefedFeedData = piefed.getFeeds!({ include_communities: true }).then(
      (i) => i.feeds.find((j) => j.id == p.feed_id),
    )

    const postPromise = piefed.getPosts(p)

    return {
      posts: (await postPromise).posts,
      next_page: (await postPromise).next_page,
      feed: piefedFeedData,
      params: { ...p, page_cursor: (await postPromise).next_page },
      client: {},
    }
  }).load({
    page_cursor: cursor,
    sort: sort,
    type_: 'All',
    limit: 20,
    show_hidden: settings.posts.showHidden,
    feed_id: Number(params.id),
  })

  return feedData
}
