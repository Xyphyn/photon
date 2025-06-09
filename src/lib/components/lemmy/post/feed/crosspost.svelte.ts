import { settings } from '$lib/settings.svelte'
import type { PostView } from 'lemmy-js-client'

export type PostViewWithCrossposts = PostView & {
  withCrossposts: true
  crossposts: PostView[]
}
export type PostViewWithoutCrossposts = PostView & { withCrossposts?: false }

export const combineCrossposts = (
  posts: PostView[],
): (PostViewWithCrossposts | PostViewWithoutCrossposts)[] => {
  const urlMap = new Map<
    string,
    PostViewWithCrossposts | PostViewWithoutCrossposts
  >()
  const results: (PostViewWithCrossposts | PostViewWithoutCrossposts)[] = []
  const seenUrls = new Set<string>()

  posts?.forEach(post => {
    if (
      !post ||
      (settings.hidePosts.deleted && post.post.deleted) ||
      (settings.hidePosts.removed && post.post.removed)
    )
      return
    if (!post?.post?.url) {
      results.push(post)
      return
    }

    const existing = urlMap.get(post.post.url)
    if (existing) {
      existing.withCrossposts = true
      if (existing.withCrossposts) {
        existing.crossposts = [...(existing.crossposts || []), post]
      }

      urlMap.set(post.post.url, existing)
    } else {
      urlMap.set(post.post.url, post)
      results.push(post)
    }
    seenUrls.add(post.post.url)
  })

  return results
}
