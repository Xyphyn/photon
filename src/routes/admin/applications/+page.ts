import { client } from '$lib/api/client.svelte'
import { urlParam } from '$lib/app/util/params'

export async function load({ fetch, url }) {
  const page = urlParam.number(url, 'page') || 1
  const type = urlParam.string(url, 'type', 'unread')

  const res = await client({ func: fetch }).listRegistrationApplications({
    page: page,
    limit: 40,
    unread_only: type == 'unread',
  })

  return {
    page: page,
    applications: res.registration_applications,
    type: type,
  }
}
