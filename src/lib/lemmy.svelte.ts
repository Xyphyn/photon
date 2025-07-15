import { profile } from '$lib/auth.svelte'
import { DEFAULT_INSTANCE_URL } from '$lib/instance.svelte.js'
import { instanceToURL } from '$lib/util.svelte'
import { error } from '@sveltejs/kit'
import { LemmyHttp, type GetSiteResponse } from 'lemmy-js-client'

class SiteData {
  #data = $state<GetSiteResponse>()

  get data() {
    return this.#data
  }

  set data(value) {
    this.#data = value
  }
}

export const site = new SiteData()

async function customFetch(
  func:
    | ((
        input: RequestInfo | URL,
        init?: RequestInit | undefined,
      ) => Promise<Response>)
    | undefined,
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  auth?: string,
): Promise<Response> {
  const f = func ? func : fetch

  if (init) {
    init.headers = {
      ...init.headers,
      'User-Agent': `Photon/${__VERSION__}`,
      ...(auth ? { authorization: `Bearer ${auth}` } : {}),
    }

    if (auth) {
      init.cache = 'no-store'
    }
  }

  const res = await f(input, init)
  if (!res.ok) error(res.status, await res.text())
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
    init?: RequestInit | undefined,
  ) => Promise<Response>
  auth?: string
} = {}) {
  if (!instanceURL)
    instanceURL = profile.current.instance || DEFAULT_INSTANCE_URL

  const jwt = auth ? auth : profile.current?.jwt

  const headers = jwt ? { authorization: `Bearer ${jwt}` } : {}

  return new LemmyHttp(instanceToURL(instanceURL), {
    fetchFunction: (input, init) => customFetch(func, input, init, jwt),
    // @ts-expect-error headers thing
    headers: headers,
  })
}

export function getClient(
  instanceURL?: string,
  func?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ) => Promise<Response>,
  auth?: string,
): LemmyHttp {
  return client({ instanceURL, func, auth })
}

export async function validateInstance(instance: string): Promise<boolean> {
  if (instance == '') return false

  try {
    await getClient(instance).getSite()

    return true
  } catch {
    return false
  }
}

export function mayBeIncompatible(
  minVersion: string,
  availableVersion: string,
) {
  if (minVersion.valueOf() === availableVersion.valueOf()) return false

  const versionFormatter = /[\d.]/
  if (
    !minVersion.match(versionFormatter) ||
    !availableVersion.match(availableVersion)
  ) {
    return true
  }

  const splitMinVersion = minVersion.split('.')
  const splitAvailableVersion = availableVersion.split('.')

  if (splitMinVersion.length !== splitAvailableVersion.length) return true

  for (let i = 0; i < splitMinVersion.length; ++i) {
    const minVersionDigit = parseInt(splitMinVersion[i])
    const availableVersionDigit = parseInt(splitAvailableVersion[i])

    if (availableVersionDigit === undefined) return true
    if (minVersionDigit < availableVersionDigit) return false
    if (availableVersionDigit < minVersionDigit) return true
  }

  return false
}
