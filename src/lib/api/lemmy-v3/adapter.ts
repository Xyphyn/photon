import { LemmyHttp } from 'lemmy-js-client-v3'
import type { BaseClient, ClientType } from '../base'

export const LemmyClientConstants = {
  password: { minLength: 8, maxLength: 60 },
}

export function createLemmyClient(
  baseUrl: string,
  args: {
    fetchFunction: (input: any, init: any) => Promise<any>
    headers: any
  },
): BaseClient {
  const client = new LemmyHttp(baseUrl, args)

  const overrides: Partial<BaseClient> = {
    type: { name: 'lemmy', baseUrl: '/api/v3' } as ClientType,
  }

  return new Proxy(overrides as BaseClient, {
    get: (target, prop, receiver) => {
      const value = Reflect.get(target, prop, receiver)
      if (value !== undefined) {
        return value
      }

      const clientValue = (client as any)[prop]
      if (typeof clientValue === 'function') {
        return clientValue.bind(client)
      }
      return clientValue
    },
  })
}

export class LemmyV3Client {
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
        if (prop === 'constructor') return LemmyV3Client
        return (target.#proxy as any)[prop]
      },
    }) as any
  }
}
