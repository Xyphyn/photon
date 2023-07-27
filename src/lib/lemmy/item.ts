import type {
  CommentView,
  CommunityView,
  PersonView,
  PostView,
} from 'lemmy-js-client'

type Result = PostView | CommentView | PersonView | CommunityView

export function getItemPublished(item: Result) {
  if ('comment' in item) {
    return item.comment.published
  } else if ('post' in item) {
    return item.post.published
  }

  if ('person' in item) {
    return item.person.published
  }

  if ('community' in item) {
    return item.community.published
  }

  return ''
}

export const isPost = (item: Result): item is PostView =>
  'post' in item && !('comment' in item)

export const isComment = (item: Result): item is CommentView =>
  'comment' in item

export const isCommunity = (item: Result): item is CommunityView =>
  'community' in item

export const isUser = (item: Result): item is PersonView => 'person' in item
