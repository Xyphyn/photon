import type { AdminPurgeCommentView } from './schemas'
import type { AdminPurgeCommunityView } from './schemas'
import type { AdminPurgePersonView } from './schemas'
import type { AdminPurgePostView } from './schemas'
import type { ModAddCommunityView } from './schemas'
import type { ModAddView } from './schemas'
import type { ModBanFromCommunityView } from './schemas'
import type { ModBanView } from './schemas'
import type { ModFeaturePostView } from './schemas'
import type { ModHideCommunityView } from './schemas'
import type { ModLockPostView } from './schemas'
import type { ModRemoveCommentView } from './schemas'
import type { ModRemoveCommunityView } from './schemas'
import type { ModRemovePostView } from './schemas'
import type { ModTransferCommunityView } from './schemas'
export interface GetModlogResponse {
  removed_posts: Array<ModRemovePostView>
  locked_posts: Array<ModLockPostView>
  featured_posts: Array<ModFeaturePostView>
  removed_comments: Array<ModRemoveCommentView>
  removed_communities: Array<ModRemoveCommunityView>
  banned_from_community: Array<ModBanFromCommunityView>
  banned: Array<ModBanView>
  added_to_community: Array<ModAddCommunityView>
  transferred_to_community: Array<ModTransferCommunityView>
  added: Array<ModAddView>
  admin_purged_persons: Array<AdminPurgePersonView>
  admin_purged_communities: Array<AdminPurgeCommunityView>
  admin_purged_posts: Array<AdminPurgePostView>
  admin_purged_comments: Array<AdminPurgeCommentView>
  hidden_communities: Array<ModHideCommunityView>
}
