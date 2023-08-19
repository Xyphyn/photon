import { getClient } from '$lib/lemmy.js'
import { isComment, isCommentView, isPostView } from '$lib/lemmy/item.js'
import type {
  CommentView,
  Person,
  PostView,
  Comment,
  Post,
} from 'lemmy-js-client'

export type SubmissionView = PostView | CommentView
export type Submission = Post | Comment

export interface ContentView {
  type: 'post' | 'comment'
  title?: string
  body: string
  creator?: Person
  id: number
}

const isSubmissionView = (
  item: SubmissionView | ContentView
): item is SubmissionView => !('type' in item)

const isSubmission = (item: Submission | ContentView): item is Submission =>
  !('type' in item)

export const contentView = (item: SubmissionView): ContentView => {
  if (isCommentView(item))
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

export const contentItem = (item: Submission): ContentView => {
  if (isComment(item))
    return {
      type: 'comment',
      body: item.content,
      id: item.id,
    }
  else
    return {
      type: 'post',
      body: item.body ?? item.name,
      title: item.name,
      id: item.id,
    }
}

export async function save(
  item: ContentView | SubmissionView,
  save: boolean,
  jwt: string
): Promise<boolean> {
  if (isSubmissionView(item)) item = contentView(item)

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
  item: ContentView | SubmissionView,
  deleted: boolean,
  jwt: string
): Promise<boolean> {
  if (isSubmissionView(item)) item = contentView(item)

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
    ).comment_view.comment.deleted
  }
  return deleted
}

export async function vote(
  item: ContentView | Submission,
  vote: number,
  jwt: string
): Promise<number> {
  if (isSubmission(item)) item = contentItem(item)

  if (item.type == 'post') {
    return (
      await getClient().likePost({
        auth: jwt,
        post_id: item.id,
        score: vote,
      })
    ).post_view.counts.score
  } else if (item.type == 'comment') {
    return (
      await getClient().likeComment({
        auth: jwt,
        comment_id: item.id,
        score: vote,
      })
    ).comment_view.counts.score
  }
  return 0
}

export async function markAsRead(
  item: ContentView | Submission,
  read: boolean,
  jwt: string
): Promise<boolean> {
  if (isSubmission(item)) item = contentItem(item)

  if (item.type == 'post') {
    return (
      await getClient().markPostAsRead({
        auth: jwt,
        post_id: item.id,
        read: read,
      })
    ).post_view.read
  }
  return false
}
