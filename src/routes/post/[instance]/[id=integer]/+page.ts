import { resolveRoute } from '$app/paths'
import { profile } from '$lib/auth.svelte.js'
import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
import { client } from '$lib/lemmy.svelte.js'
import { postFeeds } from '$lib/lemmy/postfeed.svelte.js'
import { ReactiveState, awaitIfServer } from '$lib/promise.svelte.js'
import { settings } from '$lib/settings.svelte'
import { redirect } from '@sveltejs/kit'
import type {
  GetComments,
  PostView,
  CommunityModeratorView,
  CommunityView,
} from 'lemmy-js-client'

interface PartialPost {
  post_view: PostView
  meta: Promise<{
    community_view: CommunityView
    moderators: Array<CommunityModeratorView>
    cross_posts: Array<PostView>
    post_view: PostView
  }>
}

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

function findInFeed(
  postId: number,
  feedId: 'main' | 'community',
):
  | {
      post_view: PostView
      feedData?: {
        id: 'main' | 'community'
        index: number
      }
    }
  | undefined {
  const index = postFeeds.value[feedId]?.data.posts.posts.findIndex(
    i => i.post.id == postId,
  )

  if ((index ?? -1) == -1) return

  return {
    post_view: postFeeds.value[feedId]?.data.posts.posts[index],
    feedData: {
      id: feedId,
      index: index,
    },
  }
}

export async function load({ params, url, fetch }) {
  if (profile.current.instance != params.instance)
    redirect(302, resolveRoute('/post/[instance]/[id]/confirm', params))

  // TODO use Lemmy profile default settings
  const sort = settings?.defaultSort?.comments ?? 'Hot'

  const { parentId, showContext, focus } = buildContext(
    url.searchParams.get('thread') || undefined,
  )

  const cachedPost =
    findInFeed(Number(params.id), 'main') ??
    findInFeed(Number(params.id), 'community')

  const max_depth = (cachedPost?.post_view.counts.comments ?? 0) > 100 ? 1 : 3

  const commentParams: GetComments = {
    post_id: Number(params.id),
    type_: 'All',
    page: 1,
    max_depth: max_depth,
    saved_only: false,
    sort: sort,
    parent_id: parentId,
  }

  const comments = client({ func: fetch }).getComments(commentParams)
  const post = client({ func: fetch }).getPost({
    id: Number(params.id),
  })

  const partialPost: PartialPost = {
    post_view: cachedPost ? cachedPost.post_view : (await post).post_view,
    meta: post.then(i => ({
      ...i,
    })),
  }

  return {
    thread: new ReactiveState({
      showContext: showContext,
      singleThread: parentId != undefined,
      focus,
    }),
    post: new ReactiveState(partialPost),
    commentSort: new ReactiveState(sort),
    comments: new ReactiveState((await awaitIfServer(comments)).data),
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community_view: post.then(i => i.community_view),
        },
      },
    },
    cachedFeed: cachedPost?.feedData,
  }
}
