import type { CommentId } from './schemas'
import type { PostId } from './schemas'
export interface GetPost {
  id?: PostId
  comment_id?: CommentId
}
