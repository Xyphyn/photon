import type { CommentId } from "./CommentId";
import type { CommentSortType } from "./CommentSortType";
import type { CommunityId } from "./CommunityId";
import type { ListingType } from "./ListingType";
import type { PostId } from "./PostId";
export interface GetComments {
    type_?: ListingType;
    sort?: CommentSortType;
    max_depth?: number;
    page?: number;
    limit?: number;
    community_id?: CommunityId;
    community_name?: string;
    post_id?: PostId;
    parent_id?: CommentId;
    saved_only?: boolean;
    liked_only?: boolean;
    disliked_only?: boolean;
}
