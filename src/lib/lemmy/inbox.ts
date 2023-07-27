import type {
  CommentReplyView,
  PersonMentionView,
  PrivateMessageView,
} from 'lemmy-js-client'

export type InboxItemView =
  | PersonMentionView
  | CommentReplyView
  | PrivateMessageView

export function getInboxItemPublished(item: InboxItemView): string {
  if ('comment_reply' in item) {
    return item.comment_reply.published
  }

  if ('private_message' in item) {
    return item.private_message.published
  }

  return item.person_mention.published
}

export function isRead(
  item: PersonMentionView | CommentReplyView | PrivateMessageView
) {
  if ('person_mention' in item) {
    return (item as PersonMentionView).person_mention.read
  }

  if ('comment_reply' in item) {
    return (item as CommentReplyView).comment_reply.read
  }

  if ('private_message' in item) {
    return (item as PrivateMessageView).private_message.read
  }

  return false
}
