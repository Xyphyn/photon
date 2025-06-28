import { getClient } from '$lib/client/client.svelte.js'

export async function load({ fetch }) {
  return (await getClient(undefined, fetch).getFederatedInstances())
    .federated_instances
}
