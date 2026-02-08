import { browser } from '$app/environment'
import type {
  CommentView,
  CommunityView,
  FeedView,
  GetComments,
  GetCommunityResponse,
  GetPersonDetails,
  GetPersonDetailsResponse,
  GetPost,
  GetPosts,
  ListCommunitiesResponse,
  ListingType,
  PostView,
  SortType,
  TopicView,
} from '$lib/api/types'
import { profile } from '$lib/app/auth'
import { recursiveEqual } from '$lib/app/util.svelte'
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
    if (!recursiveEqual(params, this.#lastParams)) {
      this.#data = undefined
    }
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

export interface FeedTypes {
  '/': [
    GetPosts,
    {
      posts: PostView[]
      next_page?: string
      params: GetPosts & { page_cursor: string }
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
      params: GetPosts & { page_cursor: string }
      client: { itemHeights?: (number | null)[]; lastSeen?: number }
    },
  ]
  '/u/[name]': [GetPersonDetails, { data: GetPersonDetailsResponse }]
  '/post/[instance]/[id=integer]': [
    {
      posts: GetPost
      comments: GetComments
      preload?: PostView
      thread: {
        showContext?: boolean
        singleThread?: boolean
        focus?: string
      }
    },
    {
      post: PostView
      comments: Promise<CommentView[]>
      meta: Promise<{
        community_view: CommunityView
        cross_posts: PostView[]
        post_view: PostView
      }>
      params: {
        posts: GetPost
        comments: GetComments
        thread: {
          showContext?: boolean
          singleThread?: boolean
          focus?: string
        }
      }
    },
  ]
  '/explore/communities': [
    {
      type: ListingType
      sort: SortType
      query: string
      page: number
    },
    ListCommunitiesResponse,
  ]
  '/f/[id]': [
    GetPosts,

    {
      posts: PostView[]
      next_page?: string
      params: GetPosts & { page_cursor: string }
      feed: Promise<FeedView | undefined>
      client: {
        itemHeights?: (number | null)[]
        lastSeen?: number
      }
    },
  ]
  '/topic/[id]': [
    GetPosts,
    {
      posts: PostView[]
      next_page?: string
      params: GetPosts & { page_cursor: string }
      topic: Promise<TopicView | undefined>
      client: {
        itemHeights?: (number | null)[]
        lastSeen?: number
      }
    },
  ]
  '/profile/user': [GetPersonDetails, GetPersonDetailsResponse]
}

export const feeds = new SvelteMap<keyof FeedTypes, Feed<any, any>>()

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
