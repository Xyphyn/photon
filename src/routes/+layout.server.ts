import { instance_url } from '$lib/lemmy.js'

export function load({ cookies, locals }) {
  return {
    instance_url: cookies.get('instance_url') || instance_url,
  }
}
