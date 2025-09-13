import { resolveRoute } from '$app/paths'
import { profile } from '$lib/auth.svelte.js'
import { client } from '$lib/client/lemmy.svelte'
import CommunityCard from '$lib/components/lemmy/community/CommunityCard.svelte'
import { feed } from '$lib/lemmy/feeds/feed.svelte.js'
import { settings } from '$lib/settings.svelte'
import { redirect } from '@sveltejs/kit'

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
    const resolved = feed(id, async (p) => ({
      posts: (await client().getPosts(p)).posts,
      client: {},
      params: p,
    })).peek()

    return resolved
      ? resolved?.posts?.find((i) => i.post.id.toString() == postId)
      : undefined
  } else {
    return feed(id, async (p) => ({
      ...(await client().getPosts(p)),
      client: {},
      params: p,
      community: await client().getCommunity({}),
    }))
      .peek()
      ?.posts.find((i) => i.post.id.toString() == postId)
  }
}

export async function load({ params, url, route }) {
  if (profile.current.instance != params.instance)
    redirect(302, resolveRoute('/post/[instance]/[id]/confirm', params))

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
      thread: {
        showContext,
        focus,
        singleThread: parentId != null,
      },
      params: p,
    }
  })

  const loaded = await feedData.load({
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
  })

  return {
    ...loaded,
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community_view: loaded.meta.then((i) => i.community_view),
        },
      },
    },
  }
}
