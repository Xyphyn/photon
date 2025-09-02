import type { CommunityModeratorView } from "./CommunityModeratorView";
import type { CommunityView } from "./CommunityView";
import type { PostView } from "./PostView";
export interface GetPostResponse {
    post_view: PostView;
    community_view: CommunityView;
    moderators: Array<CommunityModeratorView>;
    cross_posts: Array<PostView>;
}
