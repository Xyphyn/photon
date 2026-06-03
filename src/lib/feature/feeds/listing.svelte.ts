// the Listing class solves a problem with SvelteKit:
// properties from the `data` prop are not reactive.
// This causes problems with feeds, which are received from the data prop.

export class Listing<To, From> {
  items: To[]

  constructor(items: From[], from: (f: From) => To) {
    this.items = $state(items.map(from))
  }

  // effect = $effect.root(() => {
  //   $effect(() => {
  //     feeds.get(this.#feedId)?.update(this.items.map())
  //   })
  // })
}
