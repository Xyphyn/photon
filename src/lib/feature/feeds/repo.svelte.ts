import { browser } from '$app/environment'
import type { PostView } from '$lib/api/types'
import { PostModel } from '../post/post.svelte'

// The Repository stores client-side cache for uhh
// ok so basically now that posts are classes (PostModel) and stuff like that
// Feeds are broken. because you can't return classes from sveltekit load function
// so how do we bind and keep posts up to date?
// with the repository! it stores the one source of truth for every Model.
class Repository<Key, PrimValue, Value> {
  data: Map<Key, Value>
  #key: (primitive: PrimValue) => Key
  #from: (primitive: PrimValue) => Value

  constructor(key: (primitive: PrimValue) => Key, to: (primitive: PrimValue) => Value) {
    this.#key = key
    this.#from = to
    this.data = new Map<Key, Value>()
  }

  get = (primitive: PrimValue) => {
    if (!browser) return this.#from(primitive)

    const existing = this.data.get(this.#key(primitive))
    if (existing) return existing

    const model = this.#from(primitive)
    this.data.set(this.#key(primitive), model)

    return model
  }
}

export const repos = {
  posts: new Repository<string, PostView, PostModel>(
    (p) => p.post.ap_id,
    (p) => new PostModel(p),
  ),
}
