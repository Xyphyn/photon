import { DEFAULT_INSTANCE_URL, authData } from '$lib/lemmy.js'
import { error, redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'

export function load({ params, url }) {
  if (Number(params.instance)) {
    const split = url.pathname.split('/')

    split.splice(2, 0, `${get(authData)?.instance ?? DEFAULT_INSTANCE_URL}`)

    const newUrl = new URL(url)
    newUrl.pathname = split.join('/')

    throw redirect(300, newUrl.toString())
  }

  throw error(404, 'Not found')
}
