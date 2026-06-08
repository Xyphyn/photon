import { client } from '$lib/api/client.svelte'
import CommunityCard from '$lib/feature/community/CommunityCard.svelte'
import { repos } from '$lib/feature/feeds/repo.svelte.js'

export async function load({ fetch, params }) {
  const community = await client({ func: fetch }).getCommunity({
    name: params.name,
  })

  return {
    community: community,
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community: repos.communities.get(community.community_view),
          moderators: community.moderators,
        },
      },
    },
  }
}
