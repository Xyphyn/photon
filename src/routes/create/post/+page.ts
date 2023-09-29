import { getClient } from '$lib/lemmy.js'

export const load = ({ url }) => {
  return { crosspost: Boolean(url.searchParams.get('crosspost')) ?? false }
}
