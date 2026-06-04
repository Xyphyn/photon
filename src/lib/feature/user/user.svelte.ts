import { client } from '$lib/api/client.svelte'
import type { PersonView } from 'lemmy-js-client'

export class UserModel {
  data: PersonView

  constructor(init: PersonView) {
    this.data = $state(init)
  }

  get person() {
    return this.data.person
  }

  get personActions() {
    return this.data.person_actions ?? {}
  }

  get banned() {
    return this.data.banned
  }

  get blocked() {
    return this.personActions.blocked_at != null
  }

  async block(block: boolean = !this.blocked) {
    return await client()
      .blockPerson({
        person_id: this.person.id,
        block: block,
      })
      .then((i) => (this.data = i.person_view))
  }
}
