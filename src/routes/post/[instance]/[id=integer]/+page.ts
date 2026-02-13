import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth'
import { settings } from '$lib/app/settings.svelte'
import { ReactiveState } from '$lib/app/util.svelte'
import CommunityCard from '$lib/feature/community/CommunityCard.svelte'
import {
  Feed,
  feed,
  feeds,
  type FeedTypes,
} from '$lib/feature/feeds/feed.svelte'

function buildContext(thread?: string) {
  let parentId: number | undefined
  let showContext: boolean = false
  let max_depth = 3

  if (thread) {
    const split = thread.split('.')

    if (split[0] == '0') parentId = Number(thread.split('.')[1])
    else {
      parentId = Number(thread.split('.')[0])
      showContext = true
      max_depth = 5
    }
  }

  return { parentId, showContext, max_depth, focus: thread?.split('.').at(-1) }
}

async function findInFeed(id: '/' | '/c/[name]' | '/f/[id]', postId: string) {
  // this never actually loads anything
  if (id == '/') {
    return (feeds.get(id) as Feed<FeedTypes['/'][0], FeedTypes['/'][1]>)
      ?.peek()
      ?.posts.find((i) => i.post.id.toString() == postId)
  } else {
    return (
      feeds.get(id) as Feed<
        FeedTypes['/c/[name]'][0],
        FeedTypes['/c/[name]'][1]
      >
    )
      ?.peek()
      ?.posts.find((i) => i.post.id.toString() == postId)
  }
}

export async function load({ params, url, route }) {
  if (profile.current.instance != params.instance) {
    goto(resolve('/post/[instance]/[id=integer]/confirm', params), {
      replaceState: true,
    })
  }

  // TODO use Lemmy profile default settings
  const sort = settings?.defaultSort?.comments ?? 'Hot'

  const cachedPost =
    (await findInFeed('/', params.id)) ??
    (await findInFeed('/c/[name]', params.id)) ??
    (await findInFeed('/f/[id]', params.id))

  const {
    parentId,
    showContext,
    focus,
    max_depth: passedMaxDepth,
  } = buildContext(url.searchParams.get('thread') || undefined)

  const max_depth = passedMaxDepth

  const feedData = feed(route.id, async (p) => {
    const commentPromise = client().getComments(p.comments)
    const postPromise = client().getPost(p.posts)

    const post = p.preload ?? (await postPromise).post_view

    return {
      post: post,
      comments: commentPromise.then((i) => i.comments),
      meta: postPromise.then((i) => ({
        community_view: i.community_view,
        cross_posts: i.cross_posts,
        post_view: i.post_view,
      })),
      thread: p.thread,
      params: p,
    }
  })

  const loaded = new ReactiveState(
    await feedData.load({
      comments: {
        post_id: Number(params.id),
        type_: 'All',
        max_depth: max_depth,
        saved_only: false,
        sort: sort,
        parent_id: parentId,
      },
      posts: { id: Number(params.id) },
      preload: cachedPost,
      thread: {
        showContext: showContext,
        focus: focus,
        singleThread: parentId != null,
      },
    }),
  )

  return {
    data: loaded,
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community_view: loaded.value.meta.then((i) => i.community_view),
        },
      },
    },
  }
}
