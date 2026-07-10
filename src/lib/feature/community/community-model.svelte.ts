import { client } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth'
import type { CommunityView, MultiCommunityView } from 'lemmy-js-client'

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

export class MultiCommunityModel {
  data: MultiCommunityView

  constructor(init: MultiCommunityView) {
    this.data = $state(init)
  }

  get multi() {
    return this.data.multi
  }

  get author() {
    return this.data.owner
  }

  // TODO this could be optimized along with CommunityModel's, by making a HashMap on startup.
  // so that we don't loop over every multi-community for every multi community rendered.
  get subscribed() {
    return (
      profile.current.user?.multi_community_follows.findIndex((i) => i.multi.id == this.multi.id) !=
      -1
    )
  }

  async subscribe(subscribe: boolean = !this.subscribed) {
    const res = await client()
      .followMultiCommunity({
        multi_community_id: this.multi.id,
        follow: subscribe,
      })
      .then((res) => (this.data = res.multi_community_view))

    if (profile.current.user) {
      if (subscribe) {
        profile.current.user.multi_community_follows.push(res)
      } else {
        const idx = profile.current.user.multi_community_follows.findIndex(
          (i) => i.multi.id == this.multi.id,
        )
        if (idx != -1) profile.current.user.multi_community_follows.splice(idx, 1)
      }
    }

    return res
  }
}
