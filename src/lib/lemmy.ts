import { type GetSiteResponse, LemmyHttp } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { instance } from '$lib/instance.js'
import { instanceToURL } from '$lib/util.js'
import { profile } from '$lib/auth.js'

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

export function client({
  instanceURL,
  func,
  auth,
}: {
  instanceURL?: string
  func?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>
  auth?: string
}) {
  if (!instanceURL) instanceURL = get(instance)

  let jwt = auth ? auth : get(profile)?.jwt

  let headers = jwt ? { Authorization: `Bearer ${jwt}` } : { Authorization: '' }

  return new LemmyHttp(instanceToURL(instanceURL), {
    fetchFunction: func,
    headers: headers,
  })
}

export function getClient(
  instanceURL?: string,
  func?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
  ) => Promise<Response>,
  auth?: string
): LemmyHttp {
  return client({ instanceURL, func, auth })
}

export const getInstance = () => encodeURIComponent(get(instance))
export const site = writable<GetSiteResponse | undefined>(undefined)

export async function validateInstance(instance: string): Promise<boolean> {
  if (instance == '') return false

  try {
    await getClient(instance).getSite()

    return true
  } catch (err) {
    return false
  }
}
