import { getClient } from '$lib/client/lemmy.svelte'
import { ReactiveState } from '$lib/util.svelte.js'

export async function load({ fetch }) {
  const instances = await getClient(undefined, fetch).getFederatedInstances()

  return { instances: new ReactiveState({ ...instances.federated_instances }) }
}
