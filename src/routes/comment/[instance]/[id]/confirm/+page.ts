import { profile } from '$lib/app/auth.svelte.js'
import { redirect } from '@sveltejs/kit'

export async function load({ params }) {
  if (profile.current.instance == params.instance)
    redirect(302, `/comment/${params.instance}/${params.id}`)
}
