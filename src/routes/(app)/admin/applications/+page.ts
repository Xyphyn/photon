import { client } from '$lib/api/client.svelte'
import { ReactiveState } from '$lib/app/util.svelte'

export async function load({ fetch, url }) {
  const page = Number(url.searchParams.get('page')) || 1
  const type = url.searchParams.get('type') || 'unread'

  const res = await client({ func: fetch }).listRegistrationApplications({
    page: page,
    limit: 40,
    unread_only: type == 'unread',
  })

  return {
    page: page,
    applications: new ReactiveState(res.registration_applications),
    type: new ReactiveState(type),
  }
}
