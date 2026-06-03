import { goto } from '$app/navigation'
import { resolve } from '$app/paths'
import { client } from '$lib/api/client.svelte'
import { PiefedClient } from '$lib/api/piefed/adapter.js'
import { profile } from '$lib/app/auth'
import { settings } from '$lib/app/settings.svelte'
import CommunityCard from '$lib/feature/community/CommunityCard.svelte'
import { feed } from '$lib/feature/feeds/feed.svelte'
import { repos } from '$lib/feature/feeds/repo.svelte.js'

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

export async function load({ params, url, route }) {
  if (profile.current.instance != params.instance) {
    goto(resolve('/post/[instance]/[id=integer]/confirm', params), {
      replaceState: true,
    })
  }

  // TODO use Lemmy profile default settings
  const sort = settings?.defaultSort?.comments ?? 'Hot'

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
      comments: commentPromise.then((i) => i.items),
      meta: postPromise.then((i) => ({
        community_view: i.community_view,
        cross_posts: i.cross_posts,
        post_view: i.post_view,
      })),
      thread: p.thread,
      params: p,
    }
  })

  const loaded = await feedData.load({
    comments: {
      post_id: Number(params.id),
      type_: 'all',
      max_depth: profile.client instanceof PiefedClient ? max_depth - 1 : max_depth,
      sort: sort,
      parent_id: parentId,
      limit: 10000000000,
    },
    posts: { id: Number(params.id) },
    preload: repos.posts.peek(Number(params.id))?.data,
    thread: {
      showContext: showContext,
      focus: focus,
      singleThread: parentId != null,
    },
  })

  return {
    ...loaded,
    slots: {
      sidebar: {
        component: CommunityCard,
        props: {
          community: loaded.meta.then((i) => repos.communities.get(i.community_view)),
        },
      },
    },
  }
}
