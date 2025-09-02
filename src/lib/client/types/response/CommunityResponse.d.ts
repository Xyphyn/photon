import type { CommunityView } from "./CommunityView";
import type { LanguageId } from "./LanguageId";
export interface CommunityResponse {
    community_view: CommunityView;
    discussion_languages: Array<LanguageId>;
}
