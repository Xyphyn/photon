import { instance } from '$lib/instance.svelte'
import { client } from '$lib/client/lemmy.svelte'
import { isImage, isVideo } from '$lib/ui/image'
import { canParseUrl, findClosestNumber } from '$lib/util.svelte'
import type { CommentView, PersonView, Post } from '$lib/client/types'

export const isCommentMutable = (comment: CommentView, me: PersonView) =>
  me.person.id == comment.creator.id

// Algorithm to determine the best image URL to use
export const bestImageURL = (
  post: Post,
  thumbnail: boolean = true,
  width: number = 1024,
  format: 'avif' | 'webp' | null = 'webp',
) => {
  if (post.thumbnail_url && (thumbnail || !post.url))
    return optimizeImageURL(post.thumbnail_url, width, format)
  else if (post.url) return optimizeImageURL(post.url, width, format)

  return post.url ?? ''
}

export const optimizeImageURL = (
  urlStr: string,
  width: number = 1024,
  format: 'avif' | 'webp' | null = 'webp',
): string => {
  try {
    const url = new URL(urlStr)

    if (format) url.searchParams.set('format', format)

    if (width > 0 && !url.searchParams.has('thumbnail')) {
      url.searchParams.set(
        'thumbnail',
        findClosestNumber(
          [128, 196, 256, 512, 728, 1024, 1536],
          width,
        ).toString(),
      )
    }

    return url.toString()
  } catch (e) {
    console.error(e)
    return urlStr
  }
}

const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

export const isYoutubeLink = (url?: string): RegExpMatchArray | null => {
  if (!url) return null

  return url?.match?.(YOUTUBE_REGEX)
}

export const postLink = (post: Post) =>
  `/post/${encodeURIComponent(instance.data)}/${post.id}`

export type MediaType = 'video' | 'image' | 'iframe' | 'embed' | 'none'
export type IframeType = 'youtube' | 'video' | 'none'

export const mediaType = (url?: string): MediaType => {
  if (url) {
    if (isImage(url)) return 'image'
    if (isVideo(url)) return 'iframe'
    if (isYoutubeLink(url)) return 'iframe'
    if (canParseUrl(url)) return 'embed'
    return 'none'
  }

  return 'none'
}
export const iframeType = (url: string): IframeType => {
  if (isVideo(url)) return 'video'
  if (isYoutubeLink(url)) return 'youtube'
  return 'none'
}

export async function hidePost(
  id: number,
  hide: boolean,
  jwt: string,
): Promise<boolean> {
  await client({ auth: jwt }).hidePost({
    hide: hide,
    post_ids: [id],
  })

  return hide
}
