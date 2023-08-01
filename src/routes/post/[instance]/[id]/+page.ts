import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ params, url }) {
  const post = await getClient(params.instance.toLowerCase()).getPost({
    id: Number(params.id),
    auth: get(profile)?.jwt,
  })

  let max_depth = post.post_view.counts.comments > 100 ? 1 : 3

  const thread = url.searchParams.get('thread')
  let parentId: number | undefined

  if (thread) {
    parentId = Number(thread.split('.')[1])

    if (!Number.isInteger(parentId)) {
      parentId = undefined
    }
  }

  if (parentId) {
    max_depth = 10
  }

  return {
    singleThread: parentId != undefined,
    post: post,
    streamed: {
      comments: getClient(params.instance.toLowerCase()).getComments({
        post_id: Number(params.id),
        type_: 'All',
        limit: 25,
        page: 1,
        max_depth: max_depth,
        saved_only: false,
        sort: 'Hot',
        auth: get(profile)?.jwt,
        parent_id: parentId,
      }),
    },
  }
}
