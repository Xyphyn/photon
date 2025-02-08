import { getClient } from '$lib/lemmy.js'

export async function load({ fetch }) {
  return (await getClient(undefined, fetch).getFederatedInstances())
    .federated_instances
}
