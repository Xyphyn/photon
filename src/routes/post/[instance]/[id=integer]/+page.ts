import { env } from '$env/dynamic/public'
import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { SSR_ENABLED, userSettings } from '$lib/settings.js'
import { error } from '@sveltejs/kit'
import { get } from 'svelte/store'

export async function load({ params, url, fetch }) {
  const post = await getClient(params.instance.toLowerCase(), fetch).getPost({
    id: Number(params.id),
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

  const sort = get(userSettings)?.defaultSort?.comments ?? 'Hot'

  const commentParams: any = {
    post_id: Number(params.id),
    type_: 'All',
    limit: 50,
    page: 1,
    max_depth: max_depth,
    saved_only: false,
    sort: sort,
    parent_id: parentId,
  }

  return {
    singleThread: parentId != undefined,
    post: post,
    commentSort: sort,
    streamed: {
      comments: getClient(params.instance, fetch).getComments(commentParams),
    },
  }
}
