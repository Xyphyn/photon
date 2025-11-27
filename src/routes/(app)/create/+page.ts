import { redirect } from '@sveltejs/kit'

export function load() {
  redirect(302, '/create/post')
}
