import { client } from '$lib/client/lemmy.svelte'
import { _toModLog } from '../../../modlog/+page.js'

export async function load({ params, fetch }) {
  const modlog = client({ func: fetch })
    .getModlog({
      community_id: Number(params.id),
      limit: 5,
      page: 1,
    })
    .then((i) =>
      [
        ...i.banned_from_community,
        ...i.removed_comments,
        ...i.removed_posts,

        ...i.added_to_community,
        ...i.transferred_to_community,

        ...i.featured_posts,
        ...i.locked_posts,

        ...i.admin_purged_comments,
        ...i.admin_purged_communities,
        ...i.admin_purged_posts,
        ...i.admin_purged_persons,

        ...i.hidden_communities,
        ...i.banned,
        ...i.added,
      ]
        .map(_toModLog)
        .toSorted((a, b) => b.timestamp - a.timestamp),
    )

  const community = await client({ func: fetch }).getCommunity({
    id: Number(params.id),
  })

  return {
    community: community,
    modlog: modlog,
  }
}
