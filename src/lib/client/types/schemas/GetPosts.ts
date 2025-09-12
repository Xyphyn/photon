import type { CommunityId } from './schemas'
import type { ListingType } from './schemas'
import type { PaginationCursor } from './schemas'
import type { SortType } from './schemas'
export interface GetPosts {
  type_?: ListingType
  sort?: SortType
  page?: number
  limit?: number
  community_id?: CommunityId
  community_name?: string
  saved_only?: boolean
  liked_only?: boolean
  disliked_only?: boolean
  show_hidden?: boolean
  show_read?: boolean
  show_nsfw?: boolean
  page_cursor?: PaginationCursor
  feed_id?: string
  topic_id?: string
}
