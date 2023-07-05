import type { CommentView } from 'lemmy-js-client'

export interface CommentNodeI {
  comment_view: CommentView
  children: Array<CommentNodeI>
  depth: number
}
