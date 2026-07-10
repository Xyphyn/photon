import { client } from '$lib/api/client.svelte.js'
import type { PostSortType } from '$lib/api/types'
import { settings } from '$lib/app/settings.svelte'
import { urlParam } from '$lib/app/util/params.js'
import { feed } from '$lib/feature/feeds/feed.svelte.js'

export async function load({ params, fetch, url, route }) {
  const cursor = urlParam.optional(url, 'cursor')
  const sort = urlParam.string<PostSortType>(url, 'sort', settings.defaultSort.sort)
  const period = urlParam.number(url, 'period')

  const feedData = await feed(route.id, async (p) => {
    const postPromise = client({ func: fetch }).getPosts(p)
    const communityPromise = client({ func: fetch }).getMultiCommunity({
      name: p.multi_community_name,
    })

    return {
      multi: await communityPromise,
      posts: (await postPromise).items,
      next_page: (await postPromise).next_page,
      params: { ...p, page_cursor: (await postPromise).next_page },
      client: {},
    }
  }).load({
    multi_community_name: params.id,
    sort: sort,
    limit: 20,
    type_: 'all',
    page_cursor: cursor,
    time_range_seconds: period,
  })

  return {
    ...feedData,
  }
}
