import { getClient } from '$lib/api/client.svelte'
import { ReactiveState } from '$lib/app/util.svelte'

export async function load({ fetch }) {
  const instances = await getClient(undefined, fetch).getFederatedInstances()

  return { instances: new ReactiveState({ ...instances.federated_instances }) }
}
