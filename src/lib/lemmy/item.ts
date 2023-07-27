import type {
  CommentView,
  CommunityView,
  PersonView,
  PostView,
} from 'lemmy-js-client'

export function getItemPublished(
  item: PostView | CommentView | PersonView | CommunityView
) {
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
