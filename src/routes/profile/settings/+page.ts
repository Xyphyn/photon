import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load() {
  return (await getClient().getSite({ auth: get(profile)?.jwt })).my_user
}
