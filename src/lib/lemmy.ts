import { type GetSiteResponse, LemmyHttp } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { instance } from '$lib/instance.js'
import { instanceToURL } from '$lib/util.js'
import { profile } from '$lib/auth.js'

export const site = writable<GetSiteResponse | undefined>(undefined)

const isURL = (input: RequestInfo | URL): input is URL =>
  typeof input == 'object' && 'searchParams' in input

const toURL = (input: RequestInfo | URL): URL | undefined => {
  if (isURL(input)) return input

  try {
    return new URL(input.toString())
  } catch (e) {
    return
  }
}

async function customFetch(
  func:
    | ((
        input: RequestInfo | URL,
        init?: RequestInit | undefined
      ) => Promise<Response>)
    | undefined,
  input: RequestInfo | URL,
  init?: RequestInit | undefined,
  auth?: string
): Promise<Response> {
  const f = func ? func : fetch

  if (init?.body && auth) {
    const json = JSON.parse(init.body.toString())
    json.auth = auth
    init.body = JSON.stringify(json)
  }

  const url = toURL(input)
  if (auth && url) url.searchParams.set('auth', auth)

  const res = await f(url ?? input, init)
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
} = {}) {
  if (!instanceURL) instanceURL = get(instance)

  let jwt = auth ? auth : get(profile)?.jwt

  let headers = jwt ? { Authorization: `Bearer ${jwt}` } : { Authorization: '' }

  return new LemmyHttp(instanceToURL(instanceURL), {
    fetchFunction: (input, init) => customFetch(func, input, init, jwt),
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

export async function validateInstance(instance: string): Promise<boolean> {
  if (instance == '') return false

  try {
    await getClient(instance).getSite()

    return true
  } catch (err) {
    return false
  }
}
