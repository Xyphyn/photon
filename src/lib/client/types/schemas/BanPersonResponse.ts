import type { PersonView } from './schemas'
export interface BanPersonResponse {
  person_view: PersonView
  banned: boolean
}
