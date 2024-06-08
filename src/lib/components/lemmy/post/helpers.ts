import { getInstance } from '$lib/lemmy.js'
import type { View } from '$lib/settings'
import { isImage, isVideo } from '$lib/ui/image'
import { findClosestNumber } from '$lib/util'
import type { CommentView, PersonView, Post, PostView } from 'lemmy-js-client'

export const isCommentMutable = (comment: CommentView, me: PersonView) =>
  me.person.id == comment.creator.id

export const bestImageURL = (
  post: Post,
  compact: boolean = true,
  width: number = 1024
) => {
  if (width > 1024) {
    if (post.url) return `${post.url}?format=webp`
    else if (post.thumbnail_url) return `${post.thumbnail_url}?format=webp`
  }

  if (compact && post.thumbnail_url)
    return `${post.thumbnail_url}?thumbnail=256&format=webp`
  else if (compact && post.url) return `${post.url}?thumbnail=256&format=webp`

  if (post.url) return `${post.url}?thumbnail=${width}&format=webp`
  else if (post.thumbnail_url)
    return `${post.thumbnail_url}?thumbnail=${width}&format=webp`

  return post.url ?? ''
}

export const optimizeImageURL = (
  urlStr: string,
  width: number = 1024
): string => {
  try {
    const url = new URL(urlStr)
    url.searchParams.append('format', 'webp')
    url.searchParams.append(
      'thumbnail',
      findClosestNumber([128, 256, 512, 1024], width).toString()
    )
    return url.toString()
  } catch (e) {
    return urlStr
  }
}

const YOUTUBE_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|shorts\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/

export const isYoutubeLink = (url?: string): RegExpMatchArray | null => {
  if (!url) return null

  return url?.match?.(YOUTUBE_REGEX)
}

export const postLink = (post: Post) => `/post/${getInstance()}/${post.id}`

export type MediaType = 'video' | 'image' | 'iframe' | 'embed' | 'none'
export type IframeType = 'youtube' | 'video' | 'none'

export const mediaType = (url?: string, view: View = 'cozy'): MediaType => {
  if (url) {
    if (isImage(url)) return 'image'
    if (isVideo(url)) return 'iframe'
    if (isYoutubeLink(url)) return 'iframe'
    return 'embed'
  }

  return 'none'
}
export const iframeType = (post: Post): IframeType => {
  if (isVideo(post.url)) return 'video'
  if (isYoutubeLink(post.url)) return 'youtube'
  return 'none'
}
