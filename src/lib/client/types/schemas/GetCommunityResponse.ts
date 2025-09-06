import type { CommunityModeratorView } from './schemas'
import type { CommunityView } from './schemas'
import type { LanguageId } from './schemas'
import type { Site } from './schemas'
export interface GetCommunityResponse {
  community_view: CommunityView
  site?: Site
  moderators: Array<CommunityModeratorView>
  discussion_languages: Array<LanguageId>
}
