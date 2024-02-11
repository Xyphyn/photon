import { getInstance } from '$lib/lemmy.js'
import { redirect } from '@sveltejs/kit'

export function load({ params }) {
  // If you somehow got to /comment/instance, it likely means you passed in an ID, not an instance.
  redirect(300, `/comment/${getInstance()}/${params.instance}`);
}
