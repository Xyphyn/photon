import { authData, getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ params }) {
  const post = await getClient(params.instance.toLowerCase()).getPost({
    id: Number(params.id),
    auth: get(authData)?.token,
  })

  return {
    post: post,
    streamed: {
      comments: getClient(params.instance.toLowerCase()).getComments({
        post_id: Number(params.id),
        type_: 'All',
        limit: 25,
        page: 1,
        max_depth: post.post_view.counts.comments > 100 ? 1 : 3,
        saved_only: false,
        sort: 'Hot',
        auth: get(authData)?.token,
      }),
    },
  }
}
