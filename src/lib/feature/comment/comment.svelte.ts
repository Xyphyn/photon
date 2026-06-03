import { client } from '$lib/api/client.svelte'
import type { CommentView, Person } from '$lib/api/types'
import { profile } from '$lib/app/auth'

type VoteStatus = 'upvoted' | 'none' | 'downvoted'

export class CommentModel {
  data: CommentView

  constructor(init: CommentView) {
    this.data = $state(init)
  }

  get comment() {
    return this.data.comment
  }

  get commentActions() {
    return this.data.comment_actions ?? {}
  }

  get creator(): Person & { moderator: boolean; admin: boolean } {
    return {
      ...this.data.creator,
      moderator: this.data.creator_is_moderator,
      admin: this.data.creator_is_admin,
    }
  }

  get post() {
    return this.data.post
  }

  get community() {
    return this.data.community
  }

  get saved() {
    return this.commentActions.saved_at != null
  }

  get deleted() {
    return this.comment.deleted
  }

  get myVote(): VoteStatus {
    return this.commentActions.vote_is_upvote === true
      ? 'upvoted'
      : this.commentActions.vote_is_upvote === false
        ? 'downvoted'
        : 'none'
  }

  get canReply(): boolean {
    if (!profile.isMod(this.community) && !profile.isAdmin) {
      if (this.comment.locked) return false
    }

    return true
  }

  async vote(status: VoteStatus) {
    const voteBoolean = status == 'upvoted' ? true : status == 'downvoted' ? false : undefined

    return await client()
      .likeComment({
        comment_id: this.comment.id,
        is_upvote: voteBoolean,
      })
      .then((res) => (this.data = res.comment_view))
  }

  async edit(content: string) {
    return await client().editComment({
      comment_id: this.comment.id,
      content: content,
    })
  }

  async save(save: boolean = !this.saved) {
    return await client()
      .saveComment({
        comment_id: this.comment.id,
        save: save,
      })
      .then((res) => (this.data = res.comment_view))
  }

  async feature(feature: boolean) {
    return await client()
      .distinguishComment({
        comment_id: this.comment.id,
        distinguished: feature,
      })
      .then((res) => (this.data = res.comment_view))
  }

  async delete(deleted: boolean = !this.comment.deleted) {
    return await client()
      .deleteComment({
        comment_id: this.comment.id,
        deleted: deleted,
      })
      .then((res) => (this.data = res.comment_view))
  }
}
