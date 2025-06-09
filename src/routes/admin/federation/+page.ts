import { getClient } from '$lib/lemmy.svelte.js'

export async function load({ fetch }) {
  const instances = await getClient(undefined, fetch).getFederatedInstances()

  return {
    federated_instances: instances,
  }
}
