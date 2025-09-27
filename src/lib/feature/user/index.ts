import { client } from '$lib/api/client.svelte'
import type { Community, MyUserInfo } from '$lib/api/types'
import { profile, type ProfileInfo } from '$lib/app/auth.svelte'

// TODO obliterate this file
export async function blockUser(block: boolean, id: number) {
  const auth = profile.current?.jwt

  if (!auth) throw new Error('Unauthorized')

  await client().blockPerson({
    block: block,
    person_id: id,
  })
}

export function isBlocked(me: MyUserInfo, user: number) {
  return me.person_blocks.map((b) => b.target.id).includes(user)
}

export function addSubscription(
  community: Community,
  subscribe: boolean = true,
) {
  const index = profile.current.user?.follows
    .map((f) => f.community.id)
    .indexOf(community.id)

  if (subscribe && index == -1) {
    profile.current.user?.follows.push({
      follower: profile.current.user.follows[0]?.follower,
      community: community,
    })
  } else {
    profile.current.user?.follows.splice(index ?? 0, 1)
  }
}

export function hasFavorite(profile: ProfileInfo, id: number): boolean {
  return profile.favorites?.map((i) => i.id).includes(id) ?? false
}
