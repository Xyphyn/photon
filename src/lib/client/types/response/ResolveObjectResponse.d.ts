import type { CommentView } from "./CommentView";
import type { CommunityView } from "./CommunityView";
import type { PersonView } from "./PersonView";
import type { PostView } from "./PostView";
export interface ResolveObjectResponse {
    comment?: CommentView;
    post?: PostView;
    community?: CommunityView;
    person?: PersonView;
}
