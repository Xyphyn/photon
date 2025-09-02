import type { CommunityId } from "./CommunityId";
export interface GetReportCountResponse {
    community_id?: CommunityId;
    comment_reports: number;
    post_reports: number;
    private_message_reports?: number;
}
