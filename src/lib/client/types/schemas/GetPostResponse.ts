import type { CommunityModeratorView } from './schemas'
import type { CommunityView } from './schemas'
import type { PostView } from './schemas'
export interface GetPostResponse {
  post_view: PostView
  community_view: CommunityView
  moderators: Array<CommunityModeratorView>
  cross_posts: Array<PostView>
}
