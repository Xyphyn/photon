import type { CommentView } from "./CommentView";
import type { CommunityModeratorView } from "./CommunityModeratorView";
import type { PersonView } from "./PersonView";
import type { PostView } from "./PostView";
import type { Site } from "./Site";
export interface GetPersonDetailsResponse {
    person_view: PersonView;
    site?: Site;
    comments: Array<CommentView>;
    posts: Array<PostView>;
    moderates: Array<CommunityModeratorView>;
}
