import type { PaginationCursor } from './schemas'
import type { PostView } from './schemas'
export interface GetPostsResponse {
  posts: Array<PostView>
  next_page: PaginationCursor
}
