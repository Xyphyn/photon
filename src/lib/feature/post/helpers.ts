import { env } from '$env/dynamic/public'
import { client } from '$lib/api/client.svelte'
import type { CommentView, PersonView, Post } from '$lib/api/types'
import { profile } from '$lib/app/auth.svelte'
import {
  canParseUrl,
  findClosestNumber,
  isImage,
  isVideo,
} from '$lib/app/util.svelte'

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
    let url: URL
    try {
      url = new URL(urlStr)
    } catch {
      return urlStr
    }

    const newUrl = new URL(
      env.PUBLIC_IMAGE_PROXY ? `${env.PUBLIC_IMAGE_PROXY}/thumbnail` : url,
    )
    newUrl.searchParams.set('url', encodeURIComponent(url.toString()))

    if (format) newUrl.searchParams.set('format', format)

    if (width > 0 && !newUrl.searchParams.has('thumbnail')) {
      newUrl.searchParams.set(
        'thumbnail',
        findClosestNumber(
          [32, 64, 128, 196, 256, 512, 728, 1024, 1536],
          width,
        ).toString(),
      )
    }

    return newUrl.toString()
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

export function postLink(post: Post) {
  return `/post/${encodeURIComponent(profile.current.instance)}/${post.id}`
}

export type MediaType =
  | 'video'
  | 'image'
  | 'iframe'
  | 'embed'
  | 'poll'
  | 'event'
  | 'none'
export type IframeType = 'youtube' | 'video' | 'none'

export function mediaType(post?: Post | string): MediaType {
  if (!post) return 'none'

  const isPost = typeof post != 'string'
  const url = isPost ? post.url : post

  if (isPost) {
    if (post.poll) return 'poll'
    if (post.event) return 'event'
  }

  if (!url) return 'none'

  try {
    new URL(url)
  } catch {
    return 'none'
  }

  if (isImage(url)) return 'image'
  if (isVideo(url)) return 'iframe'
  if (isYoutubeLink(url)) return 'iframe'
  if (canParseUrl(url)) return 'embed'
  return 'none'
}

export function iframeType(url: string): IframeType {
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
