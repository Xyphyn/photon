import { profile, profileData, type Profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { trycatch } from '$lib/util.js'
import type { Community, MyUserInfo, PersonView } from 'lemmy-js-client'
import { get } from 'svelte/store'

export const blockUser = async (block: boolean, id: number) => {
  const auth = get(profile)?.jwt

  if (!auth) throw new Error('Unauthorized')

  const response = await getClient().blockPerson({
    block: block,
    person_id: id,
  })
}

export const isBlocked = (me: MyUserInfo, user: number) =>
  me.person_blocks.map((b) => b.target.id).includes(user)

export const addSubscription = (
  community: Community,
  subscribe: boolean = true
) => {
  const pd = get(profileData)
  const p = pd.profiles.find((p) => p.id == pd.profile)

  if (!p?.user) return

  if (subscribe) {
    profileData.set(pd)
  } else {
    p.user.follows.splice(
      p.user.follows.findIndex((i) => i.community.id == community.id),
      1
    )
    profileData.set(pd)
  }
}

export const addAdmin = async (handle: string, added: boolean, jwt: string) =>
  trycatch(async () => {
    const user = await getClient().resolveObject({
      q: handle,
    })

    if (!user.person) throw new Error('No user found')

    return await getClient().addAdmin({
      added: true,
      person_id: user.person.person.id,
    })
  })

export const hasFavorite = (profile: Profile, id: number): boolean =>
  profile?.favorites?.map((i) => i.id).includes(id) ?? false
