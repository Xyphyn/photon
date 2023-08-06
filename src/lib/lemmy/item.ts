import type {
  CommentReportView,
  CommentView,
  CommunityView,
  PersonView,
  PostReportView,
  PostView,
  PrivateMessage,
  PrivateMessageReportView,
  PrivateMessageView,
} from 'lemmy-js-client'

export type Result =
  | PostView
  | CommentView
  | PersonView
  | CommunityView
  | PrivateMessageView
  | PostReportView
  | CommentReportView
  | PrivateMessageReportView

export function getItemPublished(item: Result) {
  // reports... why
  if ('post_report' in item) return item.post_report.published
  if ('comment_report' in item) return item.comment_report.published
  if ('private_message_report' in item)
    return item.private_message_report.published

  // others
  if ('private_message' in item) return item.private_message.published
  if ('comment' in item) return item.comment.published
  else if ('post' in item) return item.post.published

  if ('person' in item) return item.person.published
  if ('community' in item) return item.community.published

  return ''
}

export const isPost = (item: Result): item is PostView =>
  'post' in item && !('comment' in item)

export const isComment = (item: Result): item is CommentView =>
  'comment' in item

export const isCommunity = (item: Result): item is CommunityView =>
  'community' in item

export const isUser = (item: Result): item is PersonView => 'person' in item

export const isPostReport = (item: Result): item is PostReportView =>
  'post_report' in item

export const isCommentReport = (item: Result): item is CommentReportView =>
  'comment_report' in item

export const isPrivateMessageReport = (
  item: Result
): item is PrivateMessageReportView => 'private_message_report' in item
