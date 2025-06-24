import {
  LemmyHttp,
  type GetPosts,
  type GetPostsResponse,
  type GetSiteResponse,
  type Person,
} from 'lemmy-js-client'

export class PiefedHttp extends LemmyHttp {
  // /**
  //  *
  //  * @param person A piefed person object to rewrite
  //  */
  // private rewritePerson(person: Person): Person {

  // }

  override async getSite(): Promise<GetSiteResponse> {
    const res = await super.getSite()

    console.log(res)

    return {
      ...res,
      site_view: {
        site: {
          // @ts-expect-error api difference
          ...res.site,
        },
        local_site: {
          // @ts-expect-error api difference
          downvotes_enabled: res.site.enable_downvotes,
        },
      },
    } as unknown as GetSiteResponse
  }

  // override async getPosts(params: GetPosts): Promise<GetPostsResponse> {
  //   const res = await super.getPosts(params)

  // }
}
