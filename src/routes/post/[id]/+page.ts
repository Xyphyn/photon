import { authData, getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ params }) {
  return {
    post: getClient().getPost({
      id: Number(params.id),
      auth: get(authData)?.token,
    }),
    streamed: {
      comments: getClient().getComments({
        post_id: Number(params.id),
        type_: 'All',
        limit: 250,
        page: 1,
        max_depth: 6,
        saved_only: false,
        sort: 'Hot',
        auth: get(authData)?.token,
      }),
    },
  }
}
