import { LemmyHttp, type LoginResponse } from 'lemmy-js-client'
import { writable } from 'svelte/store'

export let lemmy = new LemmyHttp(`https://lemmy.world`)
export const token = writable<LoginResponse>()
