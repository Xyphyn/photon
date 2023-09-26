import { type GetSiteResponse, LemmyHttp } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { instance } from '$lib/instance.js'

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

export async function validateInstance(instance: string): Promise<boolean> {
  if (instance == '') return false

  try {
    await getClient(instance).getSite({})

    return true
  } catch (err) {
    return false
  }
}
