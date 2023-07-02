import { getClient } from '$lib/lemmy.js'

export function load({ params }) {
  return getClient().getCommunity({ name: params.name })
}
