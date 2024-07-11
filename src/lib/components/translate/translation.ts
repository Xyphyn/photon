import { writable } from 'svelte/store'

export let text = writable<string>(undefined)
