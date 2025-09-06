import type { CommentView } from './schemas'
import type { CommunityModeratorView } from './schemas'
import type { PersonView } from './schemas'
import type { PostView } from './schemas'
import type { Site } from './schemas'
export interface GetPersonDetailsResponse {
  person_view: PersonView
  site?: Site
  comments: Array<CommentView>
  posts: Array<PostView>
  moderates: Array<CommunityModeratorView>
}
