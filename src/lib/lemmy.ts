import {
  type GetPersonDetailsResponse,
  LemmyHttp,
  type LoginResponse,
} from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { PUBLIC_PROXY_URL } from '$env/static/public'

export const DEFAULT_INSTANCE_URL = 'lemm.ee'
export let instance_url = writable(DEFAULT_INSTANCE_URL)

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

export const authData = writable<AuthData | undefined>()
export const user = writable<GetPersonDetailsResponse>()

if (typeof localStorage != 'undefined') {
  if (localStorage.getItem('user')) {
    try {
      authData.set(JSON.parse(localStorage.getItem('user') ?? ''))
    } catch (error) {
      localStorage.removeItem('user')
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

    user.set(person)

    if (typeof localStorage != 'undefined') {
      localStorage.setItem('user', JSON.stringify(data))
    }
  } catch (error) {
    authData.set(undefined)
  }
})
