import type { PersonView } from './schemas'
export interface BanFromCommunityResponse {
  person_view: PersonView
  banned: boolean
}
