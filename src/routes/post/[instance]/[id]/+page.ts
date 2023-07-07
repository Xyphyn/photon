import { authData, getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ params }) {
  return {
    post: getClient(params.instance).getPost({
      id: Number(params.id),
      auth: get(authData)?.token,
    }),
    streamed: {
      comments: getClient(params.instance).getComments({
        post_id: Number(params.id),
        type_: 'All',
        limit: 25,
        page: 1,
        max_depth: 3,
        saved_only: false,
        sort: 'Hot',
        auth: get(authData)?.token,
      }),
    },
  }
}
