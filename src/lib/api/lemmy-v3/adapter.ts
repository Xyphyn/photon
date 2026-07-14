import { LemmyHttp } from 'lemmy-js-client-v3'
import { BaseClient } from '../base'
import * as types from '../types'
import * as rewrite from './rewrite'

export class LemmyV3Client extends BaseClient {
  static constants = { password: { minLength: 8, maxLength: 128 } }

  #api: LemmyHttp

  constructor(
    baseUrl: string,
    args: {
      fetchFunction: (input: any, init: any) => Promise<any>
      headers: any
    },
  ) {
    super()
    this.#api = new LemmyHttp(baseUrl, args)
  }

  async getSite(): Promise<types.GetSiteResponse> {
    return await this.#api.getSite().then(rewrite.toSiteResponse)
  }

  async getPosts(form: types.GetPosts): Promise<types.PagedResponse<types.PostView>> {
    return await this.#api.getPosts(rewrite.fromGetPosts(form)).then(rewrite.toGetPostsResponse)
  }

  async getPost(form: types.GetPost): Promise<types.GetPostResponse> {
    return await this.#api.getPost(form).then((i) => ({
      community_view: rewrite.toCommunityView(i.community_view),
      cross_posts: i.cross_posts.map(rewrite.toPostView),
      post_view: rewrite.toPostView(i.post_view),
    }))
  }

  async getComments(form: types.GetComments): Promise<types.PagedResponse<types.CommentView>> {
    return await this.#api.getComments(rewrite.fromGetComments(form)).then((i) => ({
      items: i.comments.map(rewrite.toCommentView),
    }))
  }

  // TODO mentioned in profile.svelte.ts, in lemmyv3 and piefed this is included in getSite so this is duplicated
  async getMyUser(): Promise<types.MyUserInfo> {
    const myUser = (await this.#api.getSite()).my_user
    if (!myUser) throw new Error('No user data returned')

    return rewrite.toMyUserInfo(myUser)
  }
}
