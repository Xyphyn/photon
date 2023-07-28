import { LemmyHttp, type MyUserInfo, type PersonView } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
import { userSettings } from '$lib/settings.js'
import { env } from '$env/dynamic/public'
import { isModOfAny } from '$lib/components/lemmy/moderation/moderation.js'

export const LINKED_INSTANCE_URL = env.PUBLIC_INSTANCE_URL
export const DEFAULT_INSTANCE_URL = env.PUBLIC_INSTANCE_URL || 'lemme'
export let instance = writable(DEFAULT_INSTANCE_URL)
export let corsSupported = writable(true)

export function buildBaseUrl(instanceURL?: string) {
  if (!instanceURL) {
    instanceURL = get(instance)!
  }

  return `${env.PUBLIC_PROXY_URL!}/cors/${instanceURL}`
}

export function getClient(instanceURL?: string): LemmyHttp {
  if (!instanceURL) {
    instanceURL = get(instance)
  }

  return new LemmyHttp(
    get(corsSupported)
      ? `https://${instanceURL}`
      : `${env.PUBLIC_PROXY_URL}/cors/${instanceURL}`
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
  reports?: number
}

export const authData = writable<AuthData | undefined>()
export const user = writable<(MyUserInfo & UserData) | undefined | null>(
  undefined
)

setInterval(async () => {
  // check for unread messages
  if (!get(authData) || !get(user)) return

  const response = await getClient().getUnreadCount({
    auth: get(authData)!.token,
  })

  const u = get(user)
  if (!u) return
  u.unreads = response.mentions + response.private_messages + response.replies

  if (isModOfAny(u)) {
    const reports = await getClient().getReportCount({
      auth: get(authData)!.token,
    })

    u.reports =
      reports.comment_reports +
      reports.post_reports +
      (reports.private_message_reports ?? 0)
  }

  user.set(u)
}, 30 * 1000)

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
  if (!data?.token) {
    user.set(null)
    return
  }
  try {
    const site = await getClient().getSite({
      auth: data.token,
    })
    if (!site?.my_user) {
      user.set(null)
      throw Error('Missing user')
    }
    user.set({ ...site.my_user, unreads: 0 })
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
    user.set(null)
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

export async function uploadImage(
  image: File | null | undefined
): Promise<string | undefined> {
  if (!image || !get(authData)) return

  const formData = new FormData()
  formData.append('images[]', image)

  const response = await fetch(
    `${
      window.location.origin
    }/cors/${getInstance()}/pictrs/image?${new URLSearchParams({
      auth: get(authData)!.token,
    })}`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const json = await response.json()

  if (json.msg == 'ok') {
    return `https://${get(authData)?.instance}/pictrs/image/${
      json.files?.[0]?.file
    }`
  }

  throw new Error(`error uploading image: ${response.status}`)
}
