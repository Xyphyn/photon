import {
  type GetPersonDetailsResponse,
  LemmyHttp,
  type LoginResponse,
} from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { PUBLIC_PROXY_URL } from '$env/static/public'

export const DEFAULT_INSTANCE_URL = 'lemm.ee'
export let instance_url = writable(DEFAULT_INSTANCE_URL)

export function buildBaseUrl(instance?: string) {
  if (!instance) {
    instance = get(authData)?.instance ?? DEFAULT_INSTANCE_URL
  }

  return `${PUBLIC_PROXY_URL}/cors/${instance}`
}

export function getClient(instance?: string): LemmyHttp {
  if (!instance) {
    instance = get(authData)?.instance ?? DEFAULT_INSTANCE_URL
  }

  return new LemmyHttp(`${PUBLIC_PROXY_URL}/cors/${instance}`)
}

export interface AuthData {
  token: string
  username: string
  instance: string
}

export interface UserData {
  unreads: number
}

export const authData = writable<AuthData | undefined>()
export const user = writable<GetPersonDetailsResponse & UserData>()

setInterval(async () => {
  // check for unread messages
  if (!get(authData)) return

  const response = await getClient().getUnreadCount({
    auth: get(authData)!.token,
  })

  const u = get(user)
  u.unreads = response.mentions + response.private_messages + response.replies

  user.set(u)
}, 60 * 1000)

if (typeof localStorage != 'undefined') {
  if (localStorage.getItem('user')) {
    try {
      authData.set(JSON.parse(localStorage.getItem('user') ?? ''))
    } catch (error) {
      // keep authdata until we can verify that the user is infact invalid
    }
  }
}

authData.subscribe(async (data) => {
  if (!data) return
  try {
    const person = await getClient().getPersonDetails({
      auth: data?.token,
      username: `${data?.username}@${data?.instance}`,
    })

    user.set({ ...person, unreads: 0 })

    if (typeof localStorage != 'undefined') {
      localStorage.setItem('user', JSON.stringify(data))
    }
  } catch (error) {
    authData.set(undefined)
  }
})
