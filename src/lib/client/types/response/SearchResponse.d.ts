import type { CommentView } from "./CommentView";
import type { CommunityView } from "./CommunityView";
import type { PersonView } from "./PersonView";
import type { PostView } from "./PostView";
import type { SearchType } from "./SearchType";
export interface SearchResponse {
    type_: SearchType;
    comments: Array<CommentView>;
    posts: Array<PostView>;
    communities: Array<CommunityView>;
    users: Array<PersonView>;
}
