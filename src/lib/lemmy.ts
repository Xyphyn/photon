import { LemmyHttp, type LoginResponse } from 'lemmy-js-client'
import { writable } from 'svelte/store'
import { PUBLIC_PROXY_URL } from '$env/static/public'

export const DEFAULT_INSTANCE_URL = 'lemmy.world'

export let instance_url = writable(DEFAULT_INSTANCE_URL)

export function getClient(instance: string = `lemmy.world`): LemmyHttp {
  return new LemmyHttp(`${PUBLIC_PROXY_URL}/cors/${instance}`)
}

export const token = writable<LoginResponse>()
