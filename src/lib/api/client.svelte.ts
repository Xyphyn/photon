import { profile } from '$lib/app/auth.svelte'
import { DEFAULT_INSTANCE_URL } from '$lib/app/instance.svelte'
import { instanceToURL } from '$lib/app/util.svelte'
import { error } from '@sveltejs/kit'
import { BaseClient, DEFAULT_CLIENT_TYPE, type ClientType } from './base'
import { LemmyClient } from './lemmy/adapter'
import { PiefedClient } from './piefed/adapter'
import type { GetSiteResponse } from './types'

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
  clientType,
}: {
  instanceURL?: string
  func?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ) => Promise<Response>
  auth?: string
  clientType?: ClientType
} = {}): BaseClient {
  if (!instanceURL)
    instanceURL = profile.current.instance || DEFAULT_INSTANCE_URL

  if (!clientType) {
    clientType = profile.current.client ?? DEFAULT_CLIENT_TYPE
  }

  // we use nullish coealsiaihsa something so that
  // we can set auth = '' to remove it

  const jwt = auth ?? profile.current?.jwt

  // but not here, so that if jwt == '', it doesnt put a bearer
  const headers = jwt ? { authorization: `Bearer ${jwt}` } : {}

  return new (clientType.name == 'piefed' ? PiefedClient : LemmyClient)(
    instanceToURL(instanceURL),
    {
      fetchFunction: (input, init) => customFetch(func, input, init, jwt),
      headers: headers,
    },
  )
}

// here for parts where i forgor to switch
export function getClient(
  instanceURL?: string,
  func?: (
    input: RequestInfo | URL,
    init?: RequestInit | undefined,
  ) => Promise<Response>,
  auth?: string,
) {
  return client({ instanceURL, func, auth })
}

export async function validateInstance(
  instance: string,
  type: ClientType,
): Promise<boolean> {
  if (instance == '') return false

  try {
    await client({
      instanceURL: instance,
      clientType: type,
      auth: '',
    }).getSite()

    return true
  } catch {
    return false
  }
}
