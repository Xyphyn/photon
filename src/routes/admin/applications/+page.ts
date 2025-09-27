import { getClient } from '$lib/api/client.svelte'
import { profile } from '$lib/app/auth.svelte'
import { ReactiveState } from '$lib/app/util.svelte'

export async function load({ fetch, url }) {
  if (!profile) return

  const { jwt } = profile.current!
  if (!jwt) return

  const page = Number(url.searchParams.get('page')) || 1
  const unreadOnly = (url.searchParams.get('unreadOnly') || 'true') == 'true'

  const res = await getClient(undefined, fetch).listRegistrationApplications({
    page: page,
    limit: 40,
    unread_only: unreadOnly,
  })

  return {
    unreadOnly: unreadOnly,
    page: page,
    applications: new ReactiveState(res.registration_applications),
  }
}
