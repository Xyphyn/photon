import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ fetch, parent }) {
  const instances = await getClient(undefined, fetch).getFederatedInstances({
    auth: get(profile)?.jwt,
  })

  return {
    federated_instances: instances,
  }
}
