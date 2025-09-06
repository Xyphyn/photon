import type { VoteView } from './schemas'
export interface ListCommentLikesResponse {
  comment_likes: Array<VoteView>
}
