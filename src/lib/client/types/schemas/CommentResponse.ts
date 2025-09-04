import type { CommentView } from './schemas'
import type { LocalUserId } from './schemas'
export interface CommentResponse {
  comment_view: CommentView
  recipient_ids: Array<LocalUserId>
}
