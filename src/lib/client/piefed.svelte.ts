/* eslint-disable */
// @ts-nocheck
import {
  LemmyHttp,
  type CommentResponse,
  type CreateComment,
  type GetComments,
  type GetCommentsResponse,
  type GetPost,
  type GetPostResponse,
  type GetPosts,
  type GetPostsResponse,
  type GetSiteResponse,
  type MarkPostAsRead,
  type Person,
  type Post,
  type SuccessResponse,
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

  private static rewriteComment(comment: Comment): Comment {
    return {
      ...comment,
      content: comment.body,
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

  override async getPost(form?: GetPost): Promise<GetPostResponse> {
    const res = await super.getPost(form)

    return {
      ...res,
      post_view: {
        ...res.post_view,
        post: PiefedHttp.rewritePost(res.post_view.post),
        creator: PiefedHttp.rewritePerson(res.post_view.creator),
      },
    }
  }

  override async getComments(form?: GetComments): Promise<GetCommentsResponse> {
    const res = await super.getComments(form)

    return {
      ...res,
      comments: res.comments.map(comment => {
        return {
          ...comment,
          comment: PiefedHttp.rewriteComment(comment.comment),
          creator: PiefedHttp.rewritePerson(comment.creator),
        }
      }),
    }
  }

  override async markPostAsRead(
    form: MarkPostAsRead,
  ): Promise<SuccessResponse> {
    return {
      success: true,
    }
  }

  override async createComment(form: CreateComment): Promise<CommentResponse> {
    const res = await super.createComment({
      ...form,
      content: undefined,
      body: form.content,
    })

    return {
      ...res,
      comment_view: {
        ...res.comment_view,
        comment: PiefedHttp.rewriteComment(res.comment_view.comment),
      },
    }
  }
}
