import type { CommentId } from './schemas'
import type { CommentSortType } from './schemas'
import type { CommunityId } from './schemas'
import type { ListingType } from './schemas'
import type { PostId } from './schemas'
export interface GetComments {
  type_?: ListingType
  sort?: CommentSortType
  max_depth?: number
  page?: number
  limit?: number
  community_id?: CommunityId
  community_name?: string
  post_id?: PostId
  parent_id?: CommentId
  saved_only?: boolean
  liked_only?: boolean
  disliked_only?: boolean
}
