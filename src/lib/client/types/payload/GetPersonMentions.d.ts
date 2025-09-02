import type { CommentSortType } from "./CommentSortType";
export interface GetPersonMentions {
    sort?: CommentSortType;
    page?: number;
    limit?: number;
    unread_only?: boolean;
}
