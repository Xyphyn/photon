import { client } from '$lib/api/client.svelte'
import { ReactiveState } from '$lib/app/util.svelte'
import CommunityCard from '$lib/feature/community/CommunityCard.svelte'

export async function load({ fetch, params }) {
  const community = await client({ func: fetch }).getCommunity({
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
