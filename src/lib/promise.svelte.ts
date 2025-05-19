// to allow for loading before promises are finished on the client.

import { browser } from '$app/environment'

export const awaitIfServer = async <T>(
  promise: Promise<T>,
): Promise<{
  data: Promise<T> | T
}> => ({ data: browser ? promise : await promise })

export class ReactiveState<T> {
  value = $state<T>()!

  constructor(initialValue: T) {
    this.value = initialValue as NonNullable<T>
  }
}
