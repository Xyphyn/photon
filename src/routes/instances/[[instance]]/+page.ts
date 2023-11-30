import { profile } from '$lib/auth.js'
import { getClient } from '$lib/lemmy.js'
import { get } from 'svelte/store'

export async function load({ params, fetch }) {
  return (await getClient(params.instance, fetch).getFederatedInstances())
    .federated_instances
}
