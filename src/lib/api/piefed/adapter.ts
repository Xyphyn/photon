import createClient from 'openapi-fetch'
import {
  BaseClient,
  type ClientType,
  type NullableFnArg,
  type NullableFnReturn,
} from '../base'
import type { SubscribedType } from '../types'
import {
  fromCreateComment,
  fromCreatePost,
  fromGetComments,
  fromGetPost,
  fromGetPosts,
  fromGetReplies,
  fromListCommunities,
  fromSearch,
  toComment,
  toCommentReplyView,
  toCommentSortType,
  toCommentView,
  toCommunity,
  toCommunityView,
  toFeedView,
  toLocalSite,
  toMyUser,
  toPerson,
  toPersonMentionView,
  toPersonView,
  toPost,
  toPostView,
  toPrivateMessageView,
  toSortType,
  toTopicView,
} from './rewrite'
import type { paths } from './schema'

export class PiefedClient implements BaseClient {
  type: ClientType = { name: 'piefed', baseUrl: '/api/alpha' }

  static constants = { password: { minLength: 6, maxLength: 128 } }

  #client: ReturnType<typeof createClient<paths>>

  constructor(
    baseUrl: string,
    args: {
      fetchFunction: (input: any, init: any) => Promise<any>
      headers: any
    },
  ) {
    this.#client = createClient({
      baseUrl: baseUrl,
      // @ts-expect-error i dont feel like fixing this right now
      fetch: args.fetchFunction,
      headers: args.headers,
    })
  }

  async getSite(): ReturnType<BaseClient['getSite']> {
    const response = (await this.#client.GET('/api/alpha/site', {})).data!

    return {
      admins: response.admins.map(toPersonView),
      site_view: {
        counts: {
          comments: -1,
          communities: -1,
          posts: -1,
          site_id: -1,
          users: response.site.user_count ?? -1,
          users_active_day: -1,
          users_active_half_year: -1,
          users_active_month: -1,
          users_active_week: -1,
        },
        local_site: toLocalSite(response.site),
        site: response.site,
      },
      all_languages:
        (response.site.all_languages as {
          code: string
          id: number
          name: string
        }[]) ?? [],
      blocked_urls: [],
      custom_emojis: [],
      discussion_languages: [],
      taglines: [],
      version: response.version,
      my_user: response.my_user ? toMyUser(response.my_user) : undefined,
    }
  }

  async createPost(
    params: Parameters<BaseClient['createPost']>[0],
  ): ReturnType<BaseClient['createPost']> {
    const response = (
      await this.#client.POST('/api/alpha/post', {
        body: fromCreatePost(params),
      })
    ).data!

    return {
      post_view: toPostView(response.post_view),
    }
  }
  async getPost(
    params: Parameters<BaseClient['getPost']>[0],
  ): ReturnType<BaseClient['getPost']> {
    const response = (
      await this.#client.GET('/api/alpha/post', {
        params: { query: fromGetPost(params) },
      })
    ).data!

    return {
      community_view: toCommunityView(response.community_view!),
      cross_posts: response.cross_posts!.map(toPostView),
      moderators: response.moderators!.map((i) => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
      post_view: toPostView(response.post_view),
    }
  }

  async editPost(
    params: Parameters<BaseClient['editPost']>[0],
  ): ReturnType<BaseClient['editPost']> {
    const response = (
      await this.#client.PUT('/api/alpha/post', { body: params })
    ).data!

    return {
      post_view: toPostView(response.post_view),
    }
  }
  async deletePost(
    params: Parameters<BaseClient['deletePost']>[0],
  ): ReturnType<BaseClient['deletePost']> {
    const response = (
      await this.#client.POST('/api/alpha/post/delete', { body: params })
    ).data!

    return {
      post_view: toPostView(response.post_view),
    }
  }

  async removePost(
    params: Parameters<BaseClient['removePost']>[0],
  ): ReturnType<BaseClient['removePost']> {
    const response = (
      await this.#client.POST('/api/alpha/post/remove', { body: params })
    ).data!

    return {
      post_view: toPostView(response.post_view),
    }
  }

  async getPosts(
    params: Parameters<BaseClient['getPosts']>[0],
  ): ReturnType<BaseClient['getPosts']> {
    const response = (
      await this.#client.GET('/api/alpha/post/list', {
        params: { query: fromGetPosts(params) },
      })
    ).data!

    return {
      ...response,
      posts: response.posts.map(toPostView),
      next_page: (Number(params.page_cursor ?? 1) + 1).toString(),
    }
  }
  async likePost(
    params: Parameters<BaseClient['likePost']>[0],
  ): ReturnType<BaseClient['likePost']> {
    const response = (
      await this.#client.POST('/api/alpha/post/like', {
        body: { ...params },
      })
    ).data!

    return {
      post_view: toPostView(response.post_view),
    }
  }

  async generateTotpSecret(): ReturnType<BaseClient['generateTotpSecret']> {
    throw new Error('unsupported')
  }
  async listLogins(): ReturnType<BaseClient['listLogins']> {
    throw new Error('unsupported')
  }
  async listAllMedia(): ReturnType<BaseClient['listAllMedia']> {
    throw new Error('unsupported')
  }
  async updateTotp(): ReturnType<BaseClient['updateTotp']> {
    throw new Error('unsupported')
  }
  async getModlog(): ReturnType<BaseClient['getModlog']> {
    throw new Error('unsupported')
  }
  async search(
    params: Parameters<BaseClient['search']>[0],
  ): ReturnType<BaseClient['search']> {
    const response = (
      await this.#client.GET('/api/alpha/search', {
        params: {
          query: fromSearch(params),
        },
      })
    ).data!

    return {
      comments: [],
      communities: response.communities.map(toCommunityView),
      posts: response.posts.map(toPostView),
      users: response.users.map(toPersonView),
      type_: response.type_,
    }
  }
  async resolveObject(
    params: Parameters<BaseClient['resolveObject']>[0],
  ): ReturnType<BaseClient['resolveObject']> {
    const response = (
      await this.#client.GET('/api/alpha/resolve_object', {
        params: { query: params },
      })
    ).data!

    return {
      comment: response.comment ? toCommentView(response.comment) : undefined,
      community: response.community
        ? toCommunityView(response.community)
        : undefined,
      post: response.post ? toPostView(response.post) : undefined,
      person: response.person ? toPersonView(response.person) : undefined,
    }
  }
  async createCommunity(
    params: Parameters<BaseClient['createCommunity']>[0],
  ): ReturnType<BaseClient['createCommunity']> {
    const response = (
      await this.#client.POST('/api/alpha/community', { body: params })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
    }
  }
  async getCommunity(
    params: Parameters<BaseClient['getCommunity']>[0],
  ): ReturnType<BaseClient['getCommunity']> {
    const response = (
      await this.#client.GET('/api/alpha/community', {
        params: {
          query: params,
        },
      })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
      moderators: response.moderators.map((i) => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
    }
  }
  async editCommunity(
    params: Parameters<BaseClient['editCommunity']>[0],
  ): ReturnType<BaseClient['editCommunity']> {
    const response = (
      await this.#client.PUT('/api/alpha/community', {
        body: params,
      })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
    }
  }
  async listCommunities(
    params: Parameters<BaseClient['listCommunities']>[0],
  ): ReturnType<BaseClient['listCommunities']> {
    const response = (
      await this.#client.GET('/api/alpha/community/list', {
        params: {
          query: fromListCommunities(params),
        },
      })
    ).data!

    return {
      communities: response.communities.map(toCommunityView),
    }
  }
  async followCommunity(
    params: Parameters<BaseClient['followCommunity']>[0],
  ): ReturnType<BaseClient['followCommunity']> {
    const response = (
      await this.#client.POST('/api/alpha/community/follow', { body: params })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
    }
  }
  async blockCommunity(
    params: Parameters<BaseClient['blockCommunity']>[0],
  ): ReturnType<BaseClient['blockCommunity']> {
    const response = (
      await this.#client.POST('/api/alpha/community/block', { body: params })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
    }
  }
  async deleteCommunity(
    params: Parameters<BaseClient['deleteCommunity']>[0],
  ): ReturnType<BaseClient['deleteCommunity']> {
    const response = (
      await this.#client.POST('/api/alpha/community/delete', { body: params })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
    }
  }
  async hideCommunity(): ReturnType<BaseClient['hideCommunity']> {
    throw new Error('unsupported')
  }
  async removeCommunity(): ReturnType<BaseClient['removeCommunity']> {
    throw new Error('unsupported')
  }
  async banFromCommunity(
    params: Parameters<BaseClient['banFromCommunity']>[0],
  ): ReturnType<BaseClient['banFromCommunity']> {
    const response = // piefed has separate methods for ban/unban
      (
        params.ban
          ? await this.#client.POST('/api/alpha/community/moderate/ban', {
              body: {
                ...params,
                expiredAt: new Date(
                  params.expires ?? '6767-06-07T00:00:00.000Z',
                ).toISOString(),
                user_id: params.person_id,
                reason: params.reason ?? 'No reason provided.',
              },
            })
          : await this.#client.PUT('/api/alpha/community/moderate/unban', {
              body: {
                community_id: params.community_id,
                user_id: params.person_id,
              },
            })
      ).data!

    return {
      banned: params.ban,
      person_view: {
        person: toPerson(response.banned_user!),
        counts: { comment_count: -1, person_id: -1, post_count: -1 },
        is_admin: false,
      },
    }
  }
  async addModToCommunity(
    params: Parameters<BaseClient['addModToCommunity']>[0],
  ): ReturnType<BaseClient['addModToCommunity']> {
    const response = (
      await this.#client.POST('/api/alpha/community/mod', { body: params })
    ).data!

    return {
      moderators: response.moderators.map((i) => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
    }
  }
  async markPostAsRead(
    params: Parameters<BaseClient['markPostAsRead']>[0],
  ): ReturnType<BaseClient['markPostAsRead']> {
    await this.#client.POST('/api/alpha/post/mark_as_read', {
      body: { ...params },
    })

    return {
      success: true,
    }
  }
  async hidePost(): ReturnType<BaseClient['hidePost']> {
    throw new Error('unsupported')
  }
  async lockPost(
    params: Parameters<BaseClient['lockPost']>[0],
  ): ReturnType<BaseClient['lockPost']> {
    const response = (
      await this.#client.POST('/api/alpha/post/lock', { body: params })
    ).data!

    return {
      ...response,
      post_view: toPostView(response.post_view),
    }
  }
  async featurePost(
    params: Parameters<BaseClient['featurePost']>[0],
  ): ReturnType<BaseClient['featurePost']> {
    const response = (
      await this.#client.POST('/api/alpha/post/feature', { body: params })
    ).data!

    return {
      ...response,
      post_view: toPostView(response.post_view),
    }
  }
  async listPostLikes(
    params: Parameters<BaseClient['listPostLikes']>[0],
  ): ReturnType<BaseClient['listPostLikes']> {
    const response = (
      await this.#client.GET('/api/alpha/post/like/list', {
        params: { query: params },
      })
    ).data!

    return {
      post_likes: response.post_likes!.map((i) => ({
        ...i,
        creator_banned_from_community: false,
        creator: toPerson(i.creator),
      })),
    }
  }
  async savePost(
    params: Parameters<BaseClient['savePost']>[0],
  ): ReturnType<BaseClient['savePost']> {
    const response = (
      await this.#client.PUT('/api/alpha/post/save', { body: params })
    ).data!

    return {
      post_view: toPostView(response.post_view),
    }
  }
  async createPostReport(
    params: Parameters<BaseClient['createPostReport']>[0],
  ): ReturnType<BaseClient['createPostReport']> {
    const response = (
      await this.#client.POST('/api/alpha/post/report', { body: params })
    ).data!

    return {
      post_report_view: {
        ...response.post_report_view,
        community: toCommunity(response.post_report_view.community),
        post: toPost(response.post_report_view.post),
        creator: toPerson(response.post_report_view.creator),
        // TODO figure out if this is a bug or not
        resolver: response.post_report_view.resolver
          ? toPerson(response.post_report_view.resolver!)
          : undefined,
        post_creator: toPerson(response.post_report_view.post_creator),
        read: false,
        hidden: false,
        creator_banned_from_community: false,
        unread_comments: -1,
      },
    }
  }
  async resolvePostReport(): ReturnType<BaseClient['resolvePostReport']> {
    throw new Error('unsupported')
  }
  async listPostReports(): ReturnType<BaseClient['listPostReports']> {
    throw new Error('unsupported')
  }
  async getSiteMetadata(): ReturnType<BaseClient['getSiteMetadata']> {
    throw new Error('unsupported')
  }

  async createComment(
    params: Parameters<BaseClient['createComment']>[0],
  ): ReturnType<BaseClient['createComment']> {
    const response = (
      await this.#client.POST('/api/alpha/comment', {
        body: fromCreateComment(params),
      })
    ).data!

    return {
      ...response,
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async editComment(
    params: Parameters<BaseClient['editComment']>[0],
  ): ReturnType<BaseClient['editComment']> {
    const response = (
      await this.#client.PUT('/api/alpha/comment', {
        body: { ...params, body: params.content },
      })
    ).data!

    return {
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async deleteComment(
    params: Parameters<BaseClient['deleteComment']>[0],
  ): ReturnType<BaseClient['deleteComment']> {
    const response = (
      await this.#client.POST('/api/alpha/comment/delete', { body: params })
    ).data!

    return {
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async removeComment(
    params: Parameters<BaseClient['removeComment']>[0],
  ): ReturnType<BaseClient['removeComment']> {
    const response = (
      await this.#client.POST('/api/alpha/comment/remove', { body: params })
    ).data!

    return {
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async markCommentReplyAsRead(
    params: Parameters<BaseClient['markCommentReplyAsRead']>[0],
  ): ReturnType<BaseClient['markCommentReplyAsRead']> {
    await this.#client.POST('/api/alpha/comment/mark_as_read', {
      body: params,
    })
  }
  async likeComment(
    params: Parameters<BaseClient['likeComment']>[0],
  ): ReturnType<BaseClient['likeComment']> {
    const response = (
      await this.#client.POST('/api/alpha/comment/like', {
        body: {
          ...params,
          // TODO add private votes
          private: false,
        },
      })
    ).data!

    return {
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }

  async listCommentLikes(
    params: Parameters<BaseClient['listCommentLikes']>[0],
  ): ReturnType<BaseClient['listCommentLikes']> {
    const response = (
      await this.#client.GET('/api/alpha/comment/like/list', {
        params: { query: params },
      })
    ).data!

    return {
      comment_likes: response.comment_likes!.map((i) => ({
        ...i,
        creator: toPerson(i.creator),
      })),
    }
  }
  async saveComment(
    params: Parameters<BaseClient['saveComment']>[0],
  ): ReturnType<BaseClient['saveComment']> {
    const response = (
      await this.#client.PUT('/api/alpha/comment/save', { body: params })
    ).data!

    return {
      ...response,
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async distinguishComment(): ReturnType<BaseClient['distinguishComment']> {
    throw new Error('unsupported')
  }

  async getComments(
    params: Parameters<BaseClient['getComments']>[0],
  ): ReturnType<BaseClient['getComments']> {
    const response = (
      await this.#client.GET('/api/alpha/comment/list', {
        params: { query: fromGetComments(params) },
      })
    ).data!

    return {
      comments: response.comments.map(toCommentView),
    }
  }

  async getComment(
    params: Parameters<BaseClient['getComment']>[0],
  ): ReturnType<BaseClient['getComment']> {
    const response = (
      await this.#client.GET('/api/alpha/comment', {
        params: { query: params },
      })
    ).data!

    return {
      ...response,
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async createCommentReport(
    params: Parameters<BaseClient['createCommentReport']>[0],
  ): ReturnType<BaseClient['createCommentReport']> {
    const response = (
      await this.#client.POST('/api/alpha/comment/report', {
        body: {
          ...params,
          // TODO add remote reports
          report_remote: false,
        },
      })
    ).data!

    return {
      ...response,
      comment_report_view: {
        ...response.comment_report_view,
        comment: toComment(response.comment_report_view.comment),
        community: toCommunity(response.comment_report_view.community),
        comment_creator: toPerson(response.comment_report_view.comment_creator),
        creator: toPerson(response.comment_report_view.creator),
        post: toPost(response.comment_report_view.post),
        // TODO figure out what's wrong here
        resolver: response.comment_report_view.resolver
          ? toPerson(response.comment_report_view.resolver)
          : undefined,
        subscribed: response.comment_report_view.subscribed as SubscribedType,
      },
    }
  }
  async resolveCommentReport(): ReturnType<BaseClient['resolveCommentReport']> {
    throw new Error('unsupported')
  }
  async listCommentReports(): ReturnType<BaseClient['listCommentReports']> {
    throw new Error('unsupported')
  }
  async getPrivateMessages(
    params: Parameters<BaseClient['getPrivateMessages']>[0],
  ): ReturnType<BaseClient['getPrivateMessages']> {
    const response = (
      await this.#client.GET('/api/alpha/private_message/list', {
        params: { query: params },
      })
    ).data!

    return {
      private_messages: response.private_messages.map(toPrivateMessageView),
    }
  }
  async createPrivateMessage(
    params: Parameters<BaseClient['createPrivateMessage']>[0],
  ): ReturnType<BaseClient['createPrivateMessage']> {
    const response = (
      await this.#client.POST('/api/alpha/private_message', { body: params })
    ).data!

    return {
      ...response,
      private_message_view: toPrivateMessageView(response.private_message_view),
    }
  }
  async editPrivateMessage(
    params: Parameters<BaseClient['editPrivateMessage']>[0],
  ): ReturnType<BaseClient['editPrivateMessage']> {
    const response = (
      await this.#client.PUT('/api/alpha/private_message', { body: params })
    ).data!

    return {
      ...response,
      private_message_view: toPrivateMessageView(response.private_message_view),
    }
  }
  async deletePrivateMessage(
    params: Parameters<BaseClient['deletePrivateMessage']>[0],
  ): ReturnType<BaseClient['deletePrivateMessage']> {
    const response = (
      await this.#client.POST('/api/alpha/private_message/delete', {
        body: params,
      })
    ).data!

    return {
      ...response,
      private_message_view: toPrivateMessageView(response.private_message_view),
    }
  }
  async markPrivateMessageAsRead(
    params: Parameters<BaseClient['markPrivateMessageAsRead']>[0],
  ): ReturnType<BaseClient['markPrivateMessageAsRead']> {
    const response = (
      await this.#client.POST('/api/alpha/private_message/mark_as_read', {
        body: params,
      })
    ).data!

    return {
      ...response,
      private_message_view: toPrivateMessageView(response.private_message_view),
    }
  }
  async createPrivateMessageReport(): ReturnType<
    BaseClient['createPrivateMessageReport']
  > {
    throw new Error('unsupported')
  }
  async resolvePrivateMessageReport(): ReturnType<
    BaseClient['resolvePrivateMessageReport']
  > {
    throw new Error('unsupported')
  }
  async listPrivateMessageReports(): ReturnType<
    BaseClient['listPrivateMessageReports']
  > {
    throw new Error('unsupported')
  }
  async register(): ReturnType<BaseClient['register']> {
    throw new Error('unsupported')
  }
  async login(
    params: Parameters<BaseClient['login']>[0],
  ): ReturnType<BaseClient['login']> {
    const response = await this.#client.POST('/api/alpha/user/login', {
      body: { username: params.username_or_email, password: params.password },
    })!

    return {
      verify_email_sent: false,
      registration_created: false,
      jwt: response.data?.jwt,
    }
  }
  async logout(): ReturnType<BaseClient['logout']> {
    throw new Error('unsupported')
  }
  async getPersonDetails(
    params: Parameters<BaseClient['getPersonDetails']>[0],
  ): ReturnType<BaseClient['getPersonDetails']> {
    const response = (
      await this.#client.GET('/api/alpha/user', {
        params: {
          query: {
            ...params,
            include_content: true,
            sort: toSortType(params.sort),
          },
        },
      })
    ).data!

    return {
      comments: response.comments.map(toCommentView),
      moderates: response.moderates.map((i) => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
      person_view: toPersonView(response.person_view),
      posts: response.posts.map(toPostView),
    }
  }
  async getPersonMentions(
    params: Parameters<BaseClient['getPersonMentions']>[0],
  ): ReturnType<BaseClient['getPersonMentions']> {
    const response = (
      await this.#client.GET('/api/alpha/user/mentions', {
        params: { query: { ...params, sort: toCommentSortType(params.sort) } },
      })
    ).data!

    return {
      mentions: response.replies.map(toPersonMentionView),
    }
  }
  async markPersonMentionAsRead(
    params: Parameters<BaseClient['markPersonMentionAsRead']>[0],
  ): ReturnType<BaseClient['markPersonMentionAsRead']> {
    // @ts-expect-error this method isnt documented
    await this.#client.POST('/api/alpha/mention/mark_as_read', {
      body: params,
    })
  }
  async getReplies(
    params: Parameters<BaseClient['getReplies']>[0],
  ): ReturnType<BaseClient['getReplies']> {
    const response = (
      await this.#client.GET('/api/alpha/user/replies', {
        params: { query: fromGetReplies(params) },
      })
    ).data!

    return {
      replies: response.replies.map(toCommentReplyView),
    }
  }
  async banPerson(): ReturnType<BaseClient['banPerson']> {
    // this is for site view not community view
    throw new Error('unsupported')
  }
  async getBannedPersons(): ReturnType<BaseClient['getBannedPersons']> {
    // this is for site view not community view
    throw new Error('unsupported')
  }
  async blockPerson(
    params: Parameters<BaseClient['blockPerson']>[0],
  ): ReturnType<BaseClient['blockPerson']> {
    const response = (
      await this.#client.POST('/api/alpha/user/block', { body: params })
    ).data!

    return {
      ...response,
      person_view: toPersonView(response.person_view),
    }
  }
  async getCaptcha(): ReturnType<BaseClient['getCaptcha']> {
    throw new Error('unsupported')
  }
  async deleteAccount(): ReturnType<BaseClient['deleteAccount']> {
    throw new Error('unsupported')
  }
  async passwordReset(): ReturnType<BaseClient['passwordReset']> {
    throw new Error('unsupported')
  }
  async passwordChangeAfterReset(): ReturnType<
    BaseClient['passwordChangeAfterReset']
  > {
    throw new Error('unsupported')
  }
  async markAllAsRead(): ReturnType<BaseClient['markAllAsRead']> {
    const response = (
      await this.#client.POST('/api/alpha/user/mark_all_as_read')
    ).data!

    return {
      replies: response.replies.map(toCommentReplyView),
    }
  }
  async saveUserSettings(
    params: Parameters<BaseClient['saveUserSettings']>[0],
  ): ReturnType<BaseClient['saveUserSettings']> {
    await this.#client.PUT('/api/alpha/user/save_user_settings', {
      body: params,
    })
    return {
      success: true,
    }
  }
  async changePassword(): ReturnType<BaseClient['changePassword']> {
    throw new Error('unsupported')
  }
  async getReportCount(): ReturnType<BaseClient['getReportCount']> {
    throw new Error('unsupported')
  }
  async getUnreadCount(): ReturnType<BaseClient['getUnreadCount']> {
    return (await this.#client.GET('/api/alpha/user/unread_count')).data!
  }
  async verifyEmail(): ReturnType<BaseClient['verifyEmail']> {
    throw new Error('unsupported')
  }
  async addAdmin(): ReturnType<BaseClient['addAdmin']> {
    throw new Error('unsupported')
  }
  async getUnreadRegistrationApplicationCount(): ReturnType<
    BaseClient['getUnreadRegistrationApplicationCount']
  > {
    throw new Error('unsupported')
  }
  async listRegistrationApplications(): ReturnType<
    BaseClient['listRegistrationApplications']
  > {
    throw new Error('unsupported')
  }
  async approveRegistrationApplication(): ReturnType<
    BaseClient['approveRegistrationApplication']
  > {
    throw new Error('unsupported')
  }
  async getRegistrationApplication(): ReturnType<
    BaseClient['getRegistrationApplication']
  > {
    throw new Error('unsupported')
  }
  async purgePerson(): ReturnType<BaseClient['purgePerson']> {
    throw new Error('unsupported')
  }
  async purgeCommunity(): ReturnType<BaseClient['purgeCommunity']> {
    throw new Error('unsupported')
  }
  async purgePost(): ReturnType<BaseClient['purgePost']> {
    throw new Error('unsupported')
  }
  async purgeComment(): ReturnType<BaseClient['purgeComment']> {
    throw new Error('unsupported')
  }
  async getFederatedInstances(): ReturnType<
    BaseClient['getFederatedInstances']
  > {
    return (await this.#client.GET('/api/alpha/federated_instances')).data!
  }
  async blockInstance(
    params: Parameters<BaseClient['blockInstance']>[0],
  ): ReturnType<BaseClient['blockInstance']> {
    return (await this.#client.POST('/api/alpha/site/block', {
      body: { ...params },
    }))!.data!
  }
  async uploadImage(
    params: Parameters<BaseClient['uploadImage']>[0],
  ): ReturnType<BaseClient['uploadImage']> {
    const formData = new FormData()
    formData.append('file', params.image as File)

    const response = (
      await this.#client.POST('/api/alpha/upload/image', {
        // @ts-expect-error this is the only working way to do this
        body: formData,
      })
    ).data!

    return {
      ...response,
      msg: 'yeah it worked i think',
    }
  }

  async setFlair(
    params: NullableFnArg<BaseClient['setFlair']>[0],
  ): NullableFnReturn<BaseClient['setFlair']> {
    const response = (
      await this.#client.POST('/api/alpha/user/set_flair', { body: params })
    ).data!

    return toPersonView(response.person_view)
  }

  async editSite(): ReturnType<BaseClient['editSite']> {
    throw new Error('unsupported')
  }
  async deleteImage(): ReturnType<BaseClient['deleteImage']> {
    throw new Error('unsupported')
  }

  async getFeeds(
    params: NullableFnArg<BaseClient['getFeeds']>[0],
  ): NullableFnReturn<BaseClient['getFeeds']> {
    const response = (
      await this.#client.GET('/api/alpha/feed/list', {
        params: { query: params },
      })
    ).data!

    return {
      ...response,
      feeds: response.feeds.map(toFeedView),
    }
  }

  async getTopics(
    params: NullableFnArg<BaseClient['getTopics']>[0],
  ): NullableFnReturn<BaseClient['getTopics']> {
    const response = (
      await this.#client.GET('/api/alpha/topic/list', {
        params: { query: params },
      })
    ).data!

    return {
      ...response,
      topics: response.topics.map(toTopicView),
    }
  }

  async assignFlair(
    params: NullableFnArg<BaseClient['assignFlair']>[0],
  ): NullableFnReturn<BaseClient['assignFlair']> {
    const response = (
      await this.#client.POST('/api/alpha/post/assign_flair', {
        body: params,
      })
    ).data!

    return toPostView(response)
  }

  async listMedia(): ReturnType<BaseClient['listMedia']> {
    throw new Error('unsupported')
  }

  async voteOnPoll(
    params: NullableFnArg<BaseClient['voteOnPoll']>[0],
  ): NullableFnReturn<BaseClient['voteOnPoll']> {
    const response = (
      await this.#client.POST('/api/alpha/post/poll_vote', { body: params })
    ).data!

    return toPostView(response)
  }
}
