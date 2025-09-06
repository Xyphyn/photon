import type { CommentSortType } from './schemas'
export interface GetPersonMentions {
  sort?: CommentSortType
  page?: number
  limit?: number
  unread_only?: boolean
}
