import { getInstance } from '$lib/lemmy.js'
import type { CommentView, PersonView, Post, PostView } from 'lemmy-js-client'

export const isMutable = (post: PostView, me: PersonView) =>
  (me.person.admin && post.post.local) || me.person.id == post.creator.id

export const isCommentMutable = (comment: CommentView, me: PersonView) =>
  me.person.id == comment.creator.id

export const bestImageURL = (
  post: Post,
  compact: boolean = true,
  width: number = 1024
) => {
  if (compact && post.thumbnail_url)
    return `${post.thumbnail_url}?thumbnail=256&format=webp`
  else if (compact && post.url) return `${post.url}?thumbnail=256&format=webp`

  if (post.url) return `${post.url}?thumbnail=${width}&format=webp`
  else if (post.thumbnail_url)
    return `${post.thumbnail_url}?thumbnail=${width}&format=webp`

  return post.url ?? ''
}

export const postLink = (post: Post) => `/post/${getInstance()}/${post.id}`
