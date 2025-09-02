import type { PaginationCursor } from "./PaginationCursor";
import type { PostView } from "./PostView";
export interface GetPostsResponse {
    posts: Array<PostView>;
    next_page?: PaginationCursor;
}
