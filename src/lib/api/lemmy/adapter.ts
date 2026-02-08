import { LemmyHttp } from 'lemmy-js-client'
import type { BaseClient, ClientType } from '../base'
import { fromGetPosts, toListingType } from './rewrite'

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

    async search(params) {
      return await client.search({
        ...params,
        listing_type: toListingType(params.listing_type),
      } as any)
    },

    async listCommunities(params) {
      return await client.listCommunities({
        ...params,
        type_: toListingType(params.type_),
      } as any)
    },

    async getPosts(params) {
      return (await client.getPosts(fromGetPosts(params) as any)) as any
    },

    async getComments(params) {
      return await client.getComments({
        ...params,
        type_: toListingType(params.type_),
      } as any)
    },
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

export class LemmyClient {
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
        if (prop === 'constructor') return LemmyClient
        return (target.#proxy as any)[prop]
      },
    }) as any
  }
}
