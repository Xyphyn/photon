import {
  type GetPersonDetailsResponse,
  LemmyHttp,
  type LoginResponse,
  type Person,
  type PersonView,
} from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { PUBLIC_PROXY_URL } from '$env/static/public'
import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
import { userSettings } from '$lib/settings.js'

export const DEFAULT_INSTANCE_URL = 'lemmy.world'
export let instance = writable(DEFAULT_INSTANCE_URL)
export let corsSupported = writable(true)

export function buildBaseUrl(instanceURL?: string) {
  if (!instanceURL) {
    instanceURL = get(instance)!
  }

  return `${PUBLIC_PROXY_URL}/cors/${instanceURL}`
}

export function getClient(instanceURL?: string): LemmyHttp {
  if (!instanceURL) {
    instanceURL = get(instance)
  }

  return new LemmyHttp(
    get(corsSupported)
      ? `https://${instanceURL}`
      : `${PUBLIC_PROXY_URL}/cors/${instanceURL}`
  )
}

export const getInstance = () => get(instance)

export interface AuthData {
  token: string
  username: string
  instance: string
}

export interface UserData {
  unreads: number
}

export const authData = writable<AuthData | undefined>()
export const user = writable<(PersonView & UserData) | undefined>()

setInterval(async () => {
  // check for unread messages
  if (!get(authData) || !get(user)) return

  const response = await getClient().getUnreadCount({
    auth: get(authData)!.token,
  })

  const u = get(user)
  u!.unreads = response.mentions + response.private_messages + response.replies

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
  instance.set(
    data?.instance ?? get(userSettings).instance ?? DEFAULT_INSTANCE_URL
  )
  if (!data?.token) return

  try {
    const site = await getClient().getSite({
      auth: data.token,
    })
    if (!site?.my_user) throw Error('Missing user')
    user.set({ ...site.my_user.local_user_view, unreads: 0 })
    if (typeof localStorage != 'undefined') {
      localStorage.setItem('user', JSON.stringify(data))
    }
  } catch (error) {
    toast({
      content: 'Failed to fetch your user. Is your instance down?',
      type: ToastType.error,
    })
    console.error(error)
    authData.set(undefined)
  }
})

export async function validateInstance(instance: string): Promise<boolean> {
  if (instance == '') return false

  try {
    await getClient(instance).getSite({})

    return true
  } catch (err) {
    return false
  }
}
