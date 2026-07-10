import { LemmyHttp, type RequestState } from 'lemmy-js-client'
import type { BaseClient, ClientType } from '../base'

export const LemmyClientConstants = {
  password: { minLength: 8, maxLength: 60 },
}

// wtf is This
type UnwrapClientMethods<T> = {
  [K in keyof T]: T[K] extends (...args: infer Args) => Promise<RequestState<infer Data>>
    ? (...args: Args) => Promise<Data>
    : T[K]
}

export function createLemmyClient(
  baseUrl: string,
  args: {
    fetchFunction: (input: any, init: any) => Promise<any>
    headers: any
  },
): BaseClient {
  // Lemmy v4 wraps all API requests in a RequestState<> object. This needs to be dealt with.
  const oClient = new LemmyHttp(baseUrl, args)

  const client = new Proxy(oClient, {
    get(target, prop, receiver) {
      const oMethod = Reflect.get(target, prop, receiver)
      if (typeof oMethod === 'function') {
        return async function (...args: any[]) {
          const reqState = await oMethod.apply(target, args)

          if (reqState && reqState.state !== 'success') {
            console.error(reqState)
            throw new Error(reqState?.err ?? 'Unknown error')
          }

          return reqState.data
        }
      }
      return oMethod
    },
  }) as unknown as UnwrapClientMethods<typeof oClient> & { type: ClientType }
  return client
}

export class LemmyV4Client {
  static constants = LemmyClientConstants

  #proxy: BaseClient

  constructor(
    baseUrl: string,
    args: {
      fetchFunction: (input: any, init: any) => Promise<any>
      headers: any
    },
  ) {
    this.#proxy = createLemmyClient(baseUrl, args)

    return new Proxy(this, {
      get: (target, prop) => {
        if (prop === 'constructor') return LemmyV4Client
        return (target.#proxy as any)[prop]
      },
    }) as any
  }
}
