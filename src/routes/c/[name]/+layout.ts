import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
import { getClient } from '$lib/lemmy.svelte.js'
import { ReactiveState } from '$lib/promise.svelte'

export async function load({ fetch, params }) {
  const community = await getClient(undefined, fetch).getCommunity({
    name: params.name,
  })

  return {
    community: new ReactiveState(community),
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community_view: community.community_view,
          moderators: community.moderators,
        },
      },
    },
  }
}
