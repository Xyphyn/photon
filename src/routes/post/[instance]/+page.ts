import { instance } from '$lib/instance.js'
import { getInstance } from '$lib/lemmy.js'
import { error, redirect } from '@sveltejs/kit'
import { get } from 'svelte/store'

export function load({ params, url }) {
  if (Number(params.instance)) {
    const split = url.pathname.split('/')

    split.splice(2, 0, `${getInstance()?.toLowerCase()}`)

    const newUrl = new URL(url)
    newUrl.pathname = split.join('/')

    redirect(300, newUrl.toString());
  }

  error(404, 'Not found');
}
