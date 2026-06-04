import { client } from '$lib/api/client.svelte'
import { settings } from '$lib/app/settings.svelte'
import CommunityCard from '$lib/feature/community/CommunityCard.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte'
import { repos } from '$lib/feature/feeds/repo.svelte.js'
import type { PostSortType } from 'lemmy-js-client'

export async function load({ params, fetch, url, route }) {
  const cursor: string | undefined = url.searchParams.get('cursor') as string | undefined

  const sort: PostSortType =
    (url.searchParams.get('sort') as PostSortType) || settings.defaultSort.sort

  const feedData = await feed(route.id, async (p) => {
    const postPromise = client({ func: fetch }).getPosts(p)
    const communityPromise = client({ func: fetch }).getCommunity({
      name: p.community_name,
    })

    return {
      community: await communityPromise,
      posts: (await postPromise).items,
      next_page: (await postPromise).next_page,
      params: { ...p, page_cursor: (await postPromise).next_page },
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
          community: repos.communities.get(feedData?.community?.community_view),
          moderators: feedData?.community?.moderators,
        },
      },
    },
  }
}
