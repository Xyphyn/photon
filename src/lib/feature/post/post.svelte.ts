import { client } from '$lib/api/client.svelte'
import type { PostView } from '$lib/api/types'
import { settings } from '$lib/app/settings.svelte'
import { mediaType } from './post-helpers'

type PostVoteStatus = 'upvoted' | 'none' | 'downvoted'

export class PostModel {
  data: PostView

  constructor(init: PostView) {
    this.data = $state(init)
  }

  get post() {
    return this.data.post
  }

  get community() {
    return this.data.community
  }

  get creator() {
    return this.data.creator
  }

  get postActions() {
    return this.data.post_actions ?? {}
  }

  get communityActions() {
    return this.data.community_actions ?? {}
  }

  get userActions() {
    return this.data.person_actions ?? {}
  }

  get badges() {
    return {
      deleted: this.post.deleted,
      removed: this.post.removed,
      locked: this.post.locked,
      featured: this.post.featured_local || this.post.featured_community,
      nsfw: this.post.nsfw || this.community.nsfw,
      saved: this.postActions.saved_at != null,
      admin: this.data.creator_is_admin,
      moderator: this.data.creator_is_moderator,
    }
  }

  get subscribed(): boolean {
    return this.data.community_actions?.follow_state == 'accepted'
  }

  get mediaType() {
    return mediaType(this.post)
  }

  get read() {
    return this.postActions.read_at != null
  }

  get saved() {
    return this.postActions.saved_at != null
  }

  get hidden() {
    return this.postActions.hidden_at != null
  }

  get filterRule(): 'hide' | 'blur' | 'none' {
    if (!settings.nsfwBlur) return 'none'
    if (this.community.nsfw || this.post.nsfw) return 'blur'
    return 'none'
  }

  get myVote(): PostVoteStatus {
    return this.postActions.vote_is_upvote === true
      ? 'upvoted'
      : this.postActions.vote_is_upvote === false
        ? 'downvoted'
        : 'none'
  }

  edit(postView: PostView) {
    this.data.post = postView.post
  }

  async vote(status: PostVoteStatus) {
    return await client()
      .likePost({
        post_id: this.post.id,
        is_upvote: status == 'upvoted',
      })
      .then((res) => (this.data = res.post_view))
  }

  async save(save: boolean = !this.saved) {
    return await client()
      .savePost({
        post_id: this.post.id,
        save: save,
      })
      .then((res) => (this.data = res.post_view))
  }

  async markRead(read: boolean = !this.read) {
    return await client()
      .markPostAsRead({
        post_id: this.post.id,
        read: read,
      })
      .then((res) => (this.data = res.post_view))
  }

  async lock(lock: boolean = !this.post.locked, reason: string) {
    return await client()
      .lockPost({
        post_id: this.post.id,
        locked: lock,
        reason: reason,
      })
      .then((res) => (this.data = res.post_view))
  }

  async feature(feature: boolean, location: 'local' | 'community') {
    return await client()
      .featurePost({
        post_id: this.post.id,
        featured: feature,
        feature_type: location,
      })
      .then((res) => (this.data = res.post_view))
  }

  async delete(deleted: boolean = !this.post.deleted) {
    return await client()
      .deletePost({
        post_id: this.post.id,
        deleted: deleted,
      })
      .then((res) => (this.data = res.post_view))
  }

  async hide(hide: boolean = this.postActions.hidden_at == null) {
    return await client()
      .hidePost({
        post_id: this.post.id,
        hide: hide,
      })
      .then((res) => (this.data = res.post_view))
  }
}
