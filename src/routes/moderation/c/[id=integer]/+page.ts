import { client } from '$lib/api/client.svelte'

export async function load({ params, fetch }) {
  const modlog = client({ func: fetch }).getModlog({
    community_id: Number(params.id),
    limit: 5,
  })

  const community = await client({ func: fetch }).getCommunity({
    id: Number(params.id),
  })

  return {
    community: community,
    modlog: modlog,
  }
}
