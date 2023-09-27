import { getClient } from '$lib/lemmy.js'
import { error } from '@sveltejs/kit'

export async function load({ fetch, params }) {
  await getClient(undefined, fetch).verifyEmail({
    token: params.token,
  })
}
