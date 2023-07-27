import type { CommentView, PersonView, PostView } from 'lemmy-js-client'

export const isMutable = (post: PostView, me: PersonView) =>
  (me.person.admin && post.post.local) || me.person.id == post.creator.id

export const isCommentMutable = (comment: CommentView, me: PersonView) =>
  (me.person.admin && comment.comment.local) ||
  me.person.id == comment.creator.id
