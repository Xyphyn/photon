import { getClient } from '$lib/client/lemmy.svelte'
import { isComment, isCommentView } from '$lib/lemmy/item.js'
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
  item: SubmissionView | ContentView,
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
): Promise<boolean> {
  if (isSubmissionView(item)) item = contentView(item)

  if (item.type == 'post') {
    return (
      await getClient().savePost({
        post_id: item.id,
        save: save,
      })
    ).post_view.saved
  } else if (item.type == 'comment') {
    return (
      await getClient().saveComment({
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
): Promise<boolean> {
  if (isSubmissionView(item)) item = contentView(item)

  if (item.type == 'post') {
    return (
      await getClient().deletePost({
        post_id: item.id,
        deleted: deleted,
      })
    ).post_view.post.deleted
  } else if (item.type == 'comment') {
    return (
      await getClient().deleteComment({
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
): Promise<{ upvotes: number; downvotes: number; score: number }> {
  if (isSubmission(item)) item = contentItem(item)

  if (item.type == 'post') {
    return (
      await getClient().likePost({
        post_id: item.id,
        score: vote,
      })
    ).post_view.counts
  } else if (item.type == 'comment') {
    return (
      await getClient().likeComment({
        comment_id: item.id,
        score: vote,
      })
    ).comment_view.counts
  }
  return { upvotes: 0, downvotes: 0, score: 0 }
}

export async function markAsRead(
  item: ContentView | Submission,
  read: boolean,
): Promise<boolean> {
  if (isSubmission(item)) item = contentItem(item)

  if (item.type == 'post') {
    getClient().markPostAsRead({
      post_ids: [item.id],
      read: read,
    })
    return read
  }
  return false
}
