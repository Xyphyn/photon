import { LemmyHttp, type LoginResponse } from 'lemmy-js-client'
import { writable } from 'svelte/store'
import { PUBLIC_PROXY_URL } from '$env/static/public'

export let instance_url = 'programming.dev'
export function getClient(instance: string = `programming.dev`): LemmyHttp {
  return new LemmyHttp(`${PUBLIC_PROXY_URL}/cors/${instance}`)
}

export const token = writable<LoginResponse>()
