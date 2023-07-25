import type { PersonView, PostView } from 'lemmy-js-client'

export const isMutable = (post: PostView, me: PersonView) =>
  (me.person.admin && post.post.local) || me.person.id == post.creator.id
