import type { PersonMentionView } from './schemas'
export interface GetPersonMentionsResponse {
  mentions: Array<PersonMentionView>
}
