import { getClient } from '$lib/lemmy.svelte.js'
import { ReactiveState } from '$lib/promise.svelte.js'

export async function load({ fetch }) {
  const instances = await getClient(undefined, fetch).getFederatedInstances()

  return { instances: new ReactiveState({ ...instances.federated_instances }) }
}
