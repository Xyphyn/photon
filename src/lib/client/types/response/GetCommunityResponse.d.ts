import type { CommunityModeratorView } from "./CommunityModeratorView";
import type { CommunityView } from "./CommunityView";
import type { LanguageId } from "./LanguageId";
import type { Site } from "./Site";
export interface GetCommunityResponse {
    community_view: CommunityView;
    site?: Site;
    moderators: Array<CommunityModeratorView>;
    discussion_languages: Array<LanguageId>;
}
