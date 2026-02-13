import { goto } from '$app/navigation'
import { profile } from '$lib/app/auth'

export async function load({ params }) {
  if (profile.current.instance == params.instance)
    goto(`/comment/${params.instance}/${params.id}`, { replaceState: true })
}
