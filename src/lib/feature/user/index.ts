import { client } from '$lib/api/client.svelte'
import type { MyUserInfo } from '$lib/api/types'
import { type ProfileInfo } from '$lib/app/auth'

// TODO obliterate this file
export async function blockUser(block: boolean, id: number) {
  return await client().blockPerson({
    block: block,
    person_id: id,
  })
}

export function isBlocked(me: MyUserInfo, user: number) {
  return me.person_blocks.find((b) => b.target.id == user)
}

export function hasFavorite(profile: ProfileInfo, id: number): boolean {
  return profile.favorites?.map((i) => i.id).includes(id) ?? false
}
