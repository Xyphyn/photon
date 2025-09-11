import { settings } from '$lib/settings.svelte'
import type { SortType } from '$lib/client/types'
import { feed } from '$lib/lemmy/feeds/feed.svelte.js'
import { client } from '$lib/client/lemmy.svelte.js'
import { CommunityCard } from '$lib/components/lemmy/community'

export async function load({ params, fetch, url, route }) {
  const cursor: string | undefined = url.searchParams.get('cursor') as
    | string
    | undefined

  const sort: SortType =
    (url.searchParams.get('sort') as SortType) || settings.defaultSort.sort

  const feedData = await feed(route.id, async (p) => {
    const postPromise = client({ func: fetch }).getPosts(p)
    const communityPromise = client({ func: fetch }).getCommunity({
      name: p.community_name,
    })

    return {
      community: await communityPromise,
      posts: (await postPromise).posts,
      next_page: (await postPromise).next_page,
      params: p,
      client: {},
    }
  }).load({
    community_name: params.name,
    sort: sort,
    limit: 20,
    page_cursor: cursor,
  })

  return {
    ...feedData,
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community_view: feedData.community.community_view,
          moderators: feedData.community.moderators,
        },
      },
    },
  }
}
