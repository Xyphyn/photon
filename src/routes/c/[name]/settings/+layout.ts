import { client } from '$lib/client/lemmy.svelte'
import CommunityCard from '$comp/lemmy/community/CommunityCard.svelte'
import { ReactiveState } from '$lib/util.svelte'

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
