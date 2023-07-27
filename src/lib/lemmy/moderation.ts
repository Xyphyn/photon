import type { MyUserInfo } from 'lemmy-js-client'

export const isMod = (me: MyUserInfo, community: number) =>
  me.moderates.map((c) => c.community.id).includes(community)

export const isAdmin = (me: MyUserInfo) => me.local_user_view.person.admin
