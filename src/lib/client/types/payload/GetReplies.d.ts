import type { CommentSortType } from "./CommentSortType";
export interface GetReplies {
    sort?: CommentSortType;
    page?: number;
    limit?: number;
    unread_only?: boolean;
}
