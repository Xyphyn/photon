import type { CommentSortType } from './schemas'
export interface GetReplies {
  sort?: CommentSortType
  page?: number
  limit?: number
  unread_only?: boolean
}
