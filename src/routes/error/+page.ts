import { error } from '@sveltejs/kit'

export function load() {
  error(500, 'You asked for it.')
}
