// the Listing class solves a problem with SvelteKit:
// properties from the `data` prop are not reactive.
// This causes problems with feeds, which are received from the data prop.

export class Listing<To, From> {
  items: To[]

  constructor(
    items: From[],
    public from: (f: From) => To,
  ) {
    this.items = $state(items.map(from))
    this.from = from
  }

  add(items: From[]) {
    this.items.push(...items.map(this.from))
  }
}
