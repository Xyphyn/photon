import type { CommunityId } from './schemas'
import type { PersonId } from './schemas'
import type { SortType } from './schemas'
export interface GetPersonDetails {
  person_id?: PersonId
  username?: string
  sort?: SortType
  page?: number
  limit?: number
  community_id?: CommunityId
  saved_only?: boolean
}
