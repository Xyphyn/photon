// eslint-disable-next-line
// @ts-nocheck
import {
  LemmyHttp,
  type GetPosts,
  type GetPostsResponse,
  type GetSiteResponse,
  type Person,
  type Post,
} from 'lemmy-js-client'

export class PiefedHttp extends LemmyHttp {
  /**
   *
   * @param person A piefed person object to rewrite
   */
  private static rewritePerson(person: Person): Person {
    return {
      ...person,
      display_name: person.title,
      name: person.user_name,
    }
  }

  private static rewritePost(post: Post): Post {
    return {
      ...post,
      name: post.title,
      featured_community: post.stickied,
      updated: post.edited_at,
    }
  }

  override async getSite(): Promise<GetSiteResponse> {
    const res = await super.getSite()

    return {
      ...res,
      site_view: {
        site: {
          ...res.site,
        },
        local_site: {
          downvotes_enabled: res.site.enable_downvotes,
        },
      },
      my_user: {
        ...res.my_user,
        local_user_view: {
          ...res.my_user?.local_user_view,
          person: PiefedHttp.rewritePerson(res.my_user?.local_user_view.person),
        },
      },
    } as unknown as GetSiteResponse
  }

  override async getPosts(params: GetPosts): Promise<GetPostsResponse> {
    const res = await super.getPosts(params)

    return {
      ...res,
      posts: res.posts.map(post => {
        return {
          ...post,
          post: PiefedHttp.rewritePost(post.post),
          creator: PiefedHttp.rewritePerson(post.creator),
        }
      }),
    }
  }
}
