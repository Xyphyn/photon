import {
  type GetSiteResponse,
  LemmyHttp,
  type MyUserInfo,
  type PersonView,
} from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { env } from '$env/dynamic/public'
import { profile } from '$lib/auth.js'

export const LINKED_INSTANCE_URL = env.PUBLIC_INSTANCE_URL
export const DEFAULT_INSTANCE_URL = env.PUBLIC_INSTANCE_URL || 'lemmy.ml'
export let instance = writable(DEFAULT_INSTANCE_URL)

export function getClient(instanceURL?: string): LemmyHttp {
  if (!instanceURL) {
    instanceURL = get(instance)
  }

  return new LemmyHttp(`https://${instanceURL}`)
}

export const getInstance = () => get(instance)

export const site = writable<GetSiteResponse | undefined>(undefined)

if (LINKED_INSTANCE_URL) {
  getClient(LINKED_INSTANCE_URL)
    .getSite({})
    .then((s) => site.set(s))
}

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
  if (!image || !get(profile)?.jwt) return

  const formData = new FormData()
  formData.append('images[]', image)

  const response = await fetch(
    `${
      window.location.origin
    }/cors/${getInstance()}/pictrs/image?${new URLSearchParams({
      auth: get(profile)!.jwt!,
    })}`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const json = await response.json()

  if (json.msg == 'ok') {
    return `https://${get(profile)?.instance}/pictrs/image/${
      json.files?.[0]?.file
    }`
  }

  throw new Error(`error uploading image: ${response.status}`)
}
