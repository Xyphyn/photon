import { getClient } from '$lib/lemmy.js'
import { userSettings } from '$lib/settings.js'
import type { ListingType, SortType } from 'lemmy-js-client'
import { get } from 'svelte/store'
import { error } from '@sveltejs/kit'
import { profile } from '$lib/auth.js'
import { feature } from '$lib/version.js'
import { loadPosts } from '$lib/lemmy.ts'

export async function load({ url, fetch }) {
  return loadPosts(url, fetch);
}
