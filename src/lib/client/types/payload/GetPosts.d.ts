import type { CommunityId } from "./CommunityId";
import type { ListingType } from "./ListingType";
import type { PaginationCursor } from "./PaginationCursor";
import type { SortType } from "./SortType";
export interface GetPosts {
    type_?: ListingType;
    sort?: SortType;
    page?: number;
    limit?: number;
    community_id?: CommunityId;
    community_name?: string;
    saved_only?: boolean;
    liked_only?: boolean;
    disliked_only?: boolean;
    show_hidden?: boolean;
    show_read?: boolean;
    show_nsfw?: boolean;
    page_cursor?: PaginationCursor;
}
