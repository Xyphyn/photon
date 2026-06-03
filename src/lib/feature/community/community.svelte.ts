import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth'
import type { CommunityView } from 'lemmy-js-client'

export class CommunityModel {
  data: CommunityView

  constructor(init: CommunityView) {
    this.data = $state(init)
  }

  get community() {
    return this.data.community
  }

  get communityActions() {
    return this.data.community_actions ?? {}
  }

  get subscribed() {
    return profile.subscribed(this.community)
  }

  get blocked() {
    return this.communityActions.blocked_at != null
  }

  get banned() {
    return this.communityActions.received_ban_at != null
  }

  async subscribe(subscribe: boolean = !this.subscribed) {
    const res = await client()
      .followCommunity({
        community_id: this.community.id,
        follow: subscribe,
      })
      .then((res) => (this.data = res.community_view))

    if (profile.current.user) {
      if (subscribe) {
        profile.current.user.follows.push({
          community: res.community,
          follower: profile.current.user.local_user_view.person,
        })
      } else {
        const idx = profile.current.user.follows.findIndex(
          (i) => i.community.id == this.community.id,
        )
        if (idx != -1) profile.current.user.follows.splice(idx, 1)
      }
    }

    return res
  }

  async block(block: boolean = !this.blocked) {
    return await client()
      .blockCommunity({
        community_id: this.community.id,
        block: block,
      })
      .then((res) => (this.data = res.community_view))
  }
}
