import { getClient } from '$lib/client/client.svelte.js'

export async function load({ fetch }) {
  const instances = await getClient(undefined, fetch).getFederatedInstances()

  return {
    federated_instances: instances,
  }
}
