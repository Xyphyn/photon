import { client } from '$lib/api/client.svelte'
import type { GetPosts, PostView } from '$lib/api/types'
import COMMUNITIES from './showcaseCommunities.json'

type Fetch = typeof globalThis.fetch

const shouldShowPost = ({ post }: PostView) => !post.nsfw && !post.featured_community

export const showcaseModeEnabled = (url: URL) => url.searchParams.has('showcase')

export async function generateShowcaseFeed(fetch: Fetch, params: GetPosts) {
  const request = { ...params, type_: 'All' as const, page_cursor: undefined }

  const load = (community_name: string) =>
    client({ func: fetch })
      .getPosts({ ...request, community_name, limit: 4 })
      .then((response) => response.posts.filter(shouldShowPost))
      .catch(() => [] as PostView[])

  const columns = await Promise.all(COMMUNITIES.map(load))
  const rows = Array.from({ length: 2 }, (_, row) =>
    columns.map((column) => column[row]),
  )

  const posts = rows.flat().filter((post) => post != undefined)
  return { posts, next_page: '' }
}

export async function generateShowcaseCommunities(fetch: Fetch, instance?: string) {
  const load = (name: string) =>
    client({ func: fetch, instanceURL: instance })
      .getCommunity({ name })
      .then((response) => response.community_view)
      .catch(() => undefined)

  const communities = await Promise.all(COMMUNITIES.map(load))
  return communities.filter((community) => community != undefined)
}