import { client } from '$lib/api/client.svelte'

export async function load({ fetch }) {
  const [blocked, allowed] = await Promise.all([
    client({ func: fetch }).getFederatedInstances({ kind: 'blocked', limit: 1000 }),
    client({ func: fetch }).getFederatedInstances({ kind: 'allowed', limit: 1000 }),
  ])

  return {
    blocked: blocked.items.map((i) => i.instance),
    allowed: allowed.items.map((i) => i.instance),
  }
}
