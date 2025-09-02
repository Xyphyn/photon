import { getClient } from '$lib/client/lemmy.svelte'

export async function load({ fetch }) {
  return (await getClient(undefined, fetch).getFederatedInstances())
    .federated_instances
}
