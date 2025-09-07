import type { CommunityView } from './schemas'
import type { LanguageId } from './schemas'
export interface CommunityResponse {
  community_view: CommunityView
  discussion_languages: Array<LanguageId>
}
