import { profile } from '$lib/auth.svelte'
import { DEFAULT_INSTANCE_URL } from '$lib/instance.svelte.js'
import { instanceToURL } from '$lib/util.svelte'
import { error } from '@sveltejs/kit'
import { LemmyHttp, type GetSiteResponse } from 'lemmy-js-client'
import { PiefedHttp } from './piefed.svelte'
import { DEFAULT_CLIENT_TYPE, type ClientType } from './client'

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

// lemmy-js-client has a hardcoded API version of v3, this rewrites it to allow custom ones
function rewriteApiVersion(
  input: RequestInfo | URL,
  newUrl: string,
): RequestInfo | URL {
  const DEFAULT_API_URL_REGEX = /\/api\/v3/

  if (typeof input === 'string') {
    return input.replace(DEFAULT_API_URL_REGEX, newUrl)
  } else if (input instanceof URL) {
    input.pathname = input.pathname.replace(DEFAULT_API_URL_REGEX, newUrl)
    return input
  }

  return input
}

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
  type?: ClientType,
): Promise<Response> {
  const f = func ? func : fetch

  if (init) {
    init.headers = {
      ...init.headers,
      ...(auth ? { authorization: `Bearer ${auth}` } : {}),
    }

    if (auth) {
      init.cache = 'no-store'
    }
  }

  input = rewriteApiVersion(input, type?.baseUrl || '/api/v3')

  const res = await f(input, init)
  if (!res.ok) error(res.status, await res.text())
  return res
}

export function client({
  instanceURL,
  func,
  auth,
  type,
}: {
  instanceURL?: string
  func?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ) => Promise<Response>
  auth?: string
  type?: ClientType
} = {}) {
  if (!instanceURL) instanceURL = profile.data.instance || DEFAULT_INSTANCE_URL

  type = type ? type : profile.data.client || DEFAULT_CLIENT_TYPE

  const jwt = auth ? auth : profile.data?.jwt

  const headers = jwt ? { authorization: `Bearer ${jwt}` } : {}

  return new (type?.name == 'piefed' ? PiefedHttp : LemmyHttp)(
    instanceToURL(instanceURL),
    {
      fetchFunction: (input, init) => customFetch(func, input, init, jwt, type),
      // @ts-expect-error headers thing
      headers: headers,
    },
  )
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

export async function validateInstance(
  instance: string,
  clientType?: ClientType,
): Promise<boolean> {
  if (instance == '') return false

  try {
    await client({ instanceURL: instance, type: clientType }).getSite()

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
