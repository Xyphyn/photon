import type { CommentId } from './schemas'
import type { CommunityId } from './schemas'
import type { ModlogActionType } from './schemas'
import type { PersonId } from './schemas'
import type { PostId } from './schemas'
export interface GetModlog {
  mod_person_id?: PersonId
  community_id?: CommunityId
  page?: number
  limit?: number
  type_?: ModlogActionType
  other_person_id?: PersonId
  post_id?: PostId
  comment_id?: CommentId
}
