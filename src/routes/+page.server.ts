import { lemmy } from '$lib/lemmy.js'

export function load() {
  return lemmy.getPosts({ limit: 20, page: 1 })
}
