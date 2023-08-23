import { getInstance } from '$lib/lemmy.js'
import { redirect } from '@sveltejs/kit'

export function load({ params }) {
  throw redirect(300, `/comment/${getInstance()}/${params.instance}`)
}
