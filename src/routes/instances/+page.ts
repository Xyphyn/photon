import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ fetch }) {
  return (
    await getClient(undefined, fetch).getFederatedInstances({
      auth: get(profile)?.jwt,
    })
  ).federated_instances
}
