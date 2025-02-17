import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
import { getClient } from '$lib/lemmy.svelte.js'
import { awaitIfServer } from '$lib/promise.svelte.js'
import { SSR_ENABLED, settings } from '$lib/settings.svelte'
import type { GetComments } from 'lemmy-js-client'
import { ReactiveState } from '$lib/promise.svelte.js'

export async function load({ params, url, fetch }) {
  const thread = url.searchParams.get('thread')
  let parentId: number | undefined
  let showContext: string | undefined = undefined

  let max_depth = 3

  if (thread) {
    const split = thread.split('.')
    if (split.length >= 9) {
      const sliced = split.slice(0, split.length - 4)
      showContext = sliced[sliced.length - 1]
      parentId = Number(split[split.length - 5])
    } else {
      parentId = Number(split[1])
    }

    if (!Number.isInteger(parentId)) {
      parentId = undefined
    }
  }

  if (parentId) {
    max_depth = 10
  }

  const sort = settings?.defaultSort?.comments ?? 'Hot'

  const commentParams: GetComments = {
    post_id: Number(params.id),
    type_: 'All',
    limit: 50,
    page: 1,
    max_depth: max_depth,
    saved_only: false,
    sort: sort,
    parent_id: parentId,
  }

  const comments = getClient(params.instance, fetch).getComments(commentParams)
  const post = await getClient(params.instance.toLowerCase(), fetch).getPost({
    id: Number(params.id),
  })

  return {
    thread: new ReactiveState({
      showContext: showContext,
      singleThread: parentId != undefined,
      focus: thread?.split('.').at(-1),
    }),
    post: new ReactiveState(post),
    commentSort: new ReactiveState(sort),
    comments: new ReactiveState((await awaitIfServer(comments)).data),
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community_view: post.community_view,
        },
      },
    },
  }
}
