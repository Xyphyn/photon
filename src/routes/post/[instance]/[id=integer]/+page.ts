import { resolveRoute } from '$app/paths'
import { profile } from '$lib/auth.svelte.js'
import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
import { client } from '$lib/lemmy.svelte.js'
import { ReactiveState, awaitIfServer } from '$lib/promise.svelte.js'
import { settings } from '$lib/settings.svelte'
import { redirect } from '@sveltejs/kit'
import type { GetComments } from 'lemmy-js-client'

function buildContext(thread?: string) {
  let parentId: number | undefined
  let showContext: string | undefined
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
  }

  if (parentId) max_depth = 10
  return { parentId, showContext, max_depth, focus: thread?.split('.').at(-1) }
}

export async function load({ params, url, fetch }) {
  if (profile.data.instance != params.instance)
    redirect(302, resolveRoute('/post/[instance]/[id]/confirm', params))

  // TODO use Lemmy profile default settings
  const sort = settings?.defaultSort?.comments ?? 'Hot'

  const { parentId, showContext, max_depth, focus } = buildContext(
    url.searchParams.get('thread') || undefined,
  )

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

  const comments = client({ func: fetch }).getComments(commentParams)
  const post = await client({ func: fetch }).getPost({
    id: Number(params.id),
  })

  return {
    thread: new ReactiveState({
      showContext: showContext,
      singleThread: parentId != undefined,
      focus,
    }),
    post: new ReactiveState(post),
    commentSort: new ReactiveState(sort),
    comments: (await awaitIfServer(comments)).data,
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
