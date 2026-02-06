import { redirect } from '@sveltejs/kit'
import { innerWidth } from 'svelte/reactivity/window'

export function load({ url }) {
  if ((innerWidth.current ?? 0) > 768) redirect(302, '/settings/app')
}
