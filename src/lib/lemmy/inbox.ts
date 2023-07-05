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
