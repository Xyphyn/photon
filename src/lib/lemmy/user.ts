import { authData, getClient } from '$lib/lemmy.js'
import type { MyUserInfo, PersonView } from 'lemmy-js-client'
import { get } from 'svelte/store'

export const blockUser = async (block: boolean, id: number) => {
  const auth = get(authData)?.token

  if (!auth) throw new Error('Unauthorized')

  const response = await getClient().blockPerson({
    auth: auth,
    block: block,
    person_id: id,
  })
}

export const isBlocked = (me: MyUserInfo, user: number) =>
  me.person_blocks.map((b) => b.target.id).includes(user)
