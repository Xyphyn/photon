import { type GetSiteResponse, LemmyHttp } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { profile } from '$lib/auth.js'
import { error } from '@sveltejs/kit'
import { LINKED_INSTANCE_URL, instance } from '$lib/instance.js'

async function customFetch(
  func: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>,
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<Response> {
  const res = await func(input, init)
  if (!res.ok) throw error(res.status, await res.text())
  return res
}

export function getClient(
  instanceURL?: string,
  func?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>
): LemmyHttp {
  if (!instanceURL) {
    instanceURL = get(instance)
  }

  return new LemmyHttp(`https://${instanceURL}`, {
    fetchFunction: func
      ? (input, init) => customFetch(func, input, init)
      : undefined,
  })
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

  throw new Error(
    `${
      (await response.text().catch((_) => undefined)) ??
      'Failed to upload image'
    }: ${response.status}: ${response.statusText}`
  )
}
