import { getClient } from '$lib/lemmy.js'
import { isComment, isPost } from '$lib/lemmy/item.js'
import type { CommentView, Person, PostView } from 'lemmy-js-client'

type Submission = PostView | CommentView

export interface ContentView {
  type: 'post' | 'comment'
  title?: string
  body: string
  creator: Person
  id: number
}

const isSubmission = (item: Submission | ContentView): item is Submission =>
  !('type' in item)

export const contentView = (item: Submission): ContentView => {
  if (isComment(item))
    return {
      type: 'comment',
      body: item.comment.content,
      creator: item.creator,
      id: item.comment.id,
    }
  else
    return {
      type: 'post',
      body: item.post.body ?? item.post.name,
      title: item.post.name,
      creator: item.creator,
      id: item.post.id,
    }
}

export async function save(
  item: ContentView | Submission,
  save: boolean,
  jwt: string
): Promise<boolean> {
  if (isSubmission(item)) item = contentView(item)

  if (item.type == 'post') {
    return (
      await getClient().savePost({
        auth: jwt,
        post_id: item.id,
        save: save,
      })
    ).post_view.saved
  } else if (item.type == 'comment') {
    return (
      await getClient().saveComment({
        auth: jwt,
        comment_id: item.id,
        save: save,
      })
    ).comment_view.saved
  }
  return save
}

export async function deleteItem(
  item: ContentView | Submission,
  deleted: boolean,
  jwt: string
): Promise<boolean> {
  if (isSubmission(item)) item = contentView(item)

  if (item.type == 'post') {
    return (
      await getClient().deletePost({
        auth: jwt,
        post_id: item.id,
        deleted: deleted,
      })
    ).post_view.post.deleted
  } else if (item.type == 'comment') {
    return (
      await getClient().deleteComment({
        auth: jwt,
        comment_id: item.id,
        deleted: deleted,
      })
    ).comment_view.post.deleted
  }
  return deleted
}
