import type { CommentId } from "./CommentId";
import type { CommunityId } from "./CommunityId";
import type { ModlogActionType } from "./ModlogActionType";
import type { PersonId } from "./PersonId";
import type { PostId } from "./PostId";
export interface GetModlog {
    mod_person_id?: PersonId;
    community_id?: CommunityId;
    page?: number;
    limit?: number;
    type_?: ModlogActionType;
    other_person_id?: PersonId;
    post_id?: PostId;
    comment_id?: CommentId;
}
