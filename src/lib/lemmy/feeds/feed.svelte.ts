import { browser } from '$app/environment'
import { profile } from '$lib/auth.svelte'
import type {
  CommentView,
  CommunityView,
  GetComments,
  GetCommunityResponse,
  GetPersonDetails,
  GetPersonDetailsResponse,
  GetPost,
  GetPosts,
  PostView,
} from '$lib/client/types'
import { recursiveEqual } from '$lib/util.svelte'
import { SvelteMap } from 'svelte/reactivity'

type FetchFn<P, R> = (params: P) => R

export class Feed<Params, Response> {
  #data = $state<Response>()
  #fetch: FetchFn<Params, Response>
  #lastParams?: Params

  constructor(fetch: FetchFn<Params, Response>) {
    this.#fetch = fetch
  }

  async load(params: Params) {
    if (
      this.#lastParams &&
      params &&
      !recursiveEqual<Params>(params, this.#lastParams)
    )
      this.#data = undefined
    this.#lastParams = params

    if (this.#data == null) this.#data = await this.#fetch(params)

    return this.#data
  }

  peek() {
    return this.#data
  }

  update(value: Response) {
    this.#data = value
  }
}

interface FeedTypes {
  '/': [
    GetPosts,
    {
      posts: PostView[]
      next_page?: string
      params: GetPosts
      client: {
        itemHeights?: (number | null)[]
        lastSeen?: number
      }
    },
  ]
  '/c/[name]': [
    GetPosts,
    {
      posts: PostView[]
      community: GetCommunityResponse
      next_page?: string
      params: GetPosts
      client: { itemHeights?: (number | null)[]; lastSeen?: number }
    },
  ]
  '/u/[name]': [GetPersonDetails, { data: GetPersonDetailsResponse }]
  '/post/[instance]/[id=integer]': [
    {
      posts: GetPost
      comments: GetComments
      preload?: PostView
    },
    {
      post: PostView
      comments: Promise<CommentView[]>
      meta: Promise<{
        community_view: CommunityView
        cross_posts: PostView[]
        post_view: PostView
      }>
      thread: {
        showContext?: boolean
        singleThread?: boolean
        focus?: string
      }
      params: { posts: GetPost; comments: GetComments }
    },
  ]
}

const feeds = new SvelteMap<keyof FeedTypes, Feed<any, any>>()

export function feed<Type extends keyof FeedTypes>(
  id: Type,
  init: (params: FeedTypes[Type][0]) => Promise<FeedTypes[Type][1]>,
): Feed<FeedTypes[Type][0], FeedTypes[Type][1]> {
  const feed = feeds.get(id)
  if (browser && feed) return feed

  const feedData = new Feed<any, any>(init)
  feeds.set(id, feedData)

  return feedData
}

// feed hooks
$effect.root(() => {
  $effect(() => {
    if (profile.meta.profile) feeds.clear()
  })
})
