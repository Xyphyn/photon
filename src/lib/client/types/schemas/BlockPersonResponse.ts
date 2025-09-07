import type { PersonView } from './schemas'
export interface BlockPersonResponse {
  person_view: PersonView
  blocked: boolean
}
