import type { CommentView } from "./CommentView";
import type { LocalUserId } from "./LocalUserId";
export interface CommentResponse {
    comment_view: CommentView;
    recipient_ids: Array<LocalUserId>;
}
