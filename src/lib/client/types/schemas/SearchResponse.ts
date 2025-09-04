import type { CommentView } from './schemas'
import type { CommunityView } from './schemas'
import type { PersonView } from './schemas'
import type { PostView } from './schemas'
import type { SearchType } from './schemas'
export interface SearchResponse {
  type_: SearchType
  comments: Array<CommentView>
  posts: Array<PostView>
  communities: Array<CommunityView>
  users: Array<PersonView>
}
