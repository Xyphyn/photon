import type { CommentId } from "./CommentId";
import type { PostId } from "./PostId";
export interface GetPost {
    id?: PostId;
    comment_id?: CommentId;
}
