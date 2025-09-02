import type { PersonId } from "./PersonId";
export interface GetPrivateMessages {
    unread_only?: boolean;
    page?: number;
    limit?: number;
    creator_id?: PersonId;
}
