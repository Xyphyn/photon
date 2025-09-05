import createClient from 'openapi-fetch'
import type { BaseClient } from '../base'
import {
  fromCreateComment,
  fromCreatePost,
  fromGetComments,
  fromGetPost,
  fromGetPosts,
  fromGetReplies,
  fromListCommunities,
  fromSearch,
  toCommentReplyView,
  toCommentSortType,
  toCommentView,
  toCommunity,
  toCommunityView,
  toLocalSite,
  toMyUser,
  toPerson,
  toPersonMentionView,
  toPersonView,
  toPostView,
  toPrivateMessageView,
} from './rewrite'
import type { paths } from './schema'
import type { ClientType } from '../lemmy.svelte'

export class PiefedClient implements BaseClient {
  type: ClientType = { name: 'piefed', baseUrl: '/api/alpha' }

  #client: ReturnType<typeof createClient<paths>>

  constructor(
    baseUrl: string,
    args: {
      fetchFunction: (input: any, init: any) => Promise<any>
      headers: any
    },
  ) {
    this.#client = createClient({
      baseUrl: `${baseUrl}/api/alpha`,
      // @ts-expect-error i dont feel like fixing this right now
      fetch: args.fetchFunction,
      headers: args.headers,
    })
  }

  async getSite(): ReturnType<BaseClient['getSite']> {
    // throw new Error('unimplemented')

    const response = (await this.#client.GET('/site')).data!

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
      await this.#client.POST('/post', {
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
      await this.#client.GET('/post', {
        // @ts-expect-error same here what is happening
        params: { query: fromGetPost(params) },
      })
    ).data!

    return {
      community_view: toCommunityView(response.community_view),
      cross_posts: response.cross_posts.map(toPostView),
      moderators: response.moderators.map(i => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
      post_view: toPostView(response.post_view),
    }
  }

  async editPost(
    params: Parameters<BaseClient['editPost']>[0],
  ): ReturnType<BaseClient['editPost']> {
    const response = (await this.#client.PUT('/post', { body: params })).data!

    return {
      post_view: toPostView(response.post_view),
    }
  }
  async deletePost(
    params: Parameters<BaseClient['deletePost']>[0],
  ): ReturnType<BaseClient['deletePost']> {
    const response = (await this.#client.POST('/post/delete', { body: params }))
      .data!

    return {
      post_view: toPostView(response.post_view),
    }
  }

  async removePost(
    params: Parameters<BaseClient['removePost']>[0],
  ): ReturnType<BaseClient['removePost']> {
    const response = (await this.#client.POST('/post/remove', { body: params }))
      .data!

    return {
      post_view: toPostView(response.post_view),
    }
  }

  async getPosts(
    params: Parameters<BaseClient['getPosts']>[0],
  ): ReturnType<BaseClient['getPosts']> {
    const response = (
      await this.#client.GET('/post/list', {
        // @ts-expect-error same here what is happening
        params: { query: fromGetPosts(params) },
      })
    ).data!

    return {
      posts: response.posts.map(toPostView),
      next_page: (Number(params.page_cursor ?? 1) + 1).toString(),
    }
  }
  async likePost(
    params: Parameters<BaseClient['likePost']>[0],
  ): ReturnType<BaseClient['likePost']> {
    // TODO remove any
    return (await this.#client.POST('/post/like', {
      body: { ...params },
    })) as any
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
      await this.#client.GET('/search', {
        params: {
          // @ts-expect-error same here what is happening
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
      await this.#client.GET('/resolve_object', {
        // @ts-expect-error same here what is happening
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
    ...params: Parameters<BaseClient['createCommunity']>
  ): ReturnType<BaseClient['createCommunity']> {
    throw new Error('unimplemented')
  }
  async getCommunity(
    params: Parameters<BaseClient['getCommunity']>[0],
  ): ReturnType<BaseClient['getCommunity']> {
    const response = (
      await this.#client.GET('/community', {
        params: {
          // @ts-expect-error same here what is happening
          query: params,
        },
      })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
      moderators: response.moderators.map(i => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
    }
  }
  async editCommunity(
    ...params: Parameters<BaseClient['editCommunity']>
  ): ReturnType<BaseClient['editCommunity']> {
    throw new Error('unimplemented')
  }
  async listCommunities(
    params: Parameters<BaseClient['listCommunities']>[0],
  ): ReturnType<BaseClient['listCommunities']> {
    const response = (
      await this.#client.GET('/community/list', {
        params: {
          // @ts-expect-error same here what is happening
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
      await this.#client.POST('/community/follow', { body: params })
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
      await this.#client.POST('/community/block', { body: params })
    ).data!

    return {
      ...response,
      community_view: toCommunityView(response.community_view),
    }
  }
  async deleteCommunity(
    ...params: Parameters<BaseClient['deleteCommunity']>
  ): ReturnType<BaseClient['deleteCommunity']> {
    throw new Error('unimplemented')
  }
  async hideCommunity(
    ...params: Parameters<BaseClient['hideCommunity']>
  ): ReturnType<BaseClient['hideCommunity']> {
    throw new Error('unimplemented')
  }
  async removeCommunity(
    ...params: Parameters<BaseClient['removeCommunity']>
  ): ReturnType<BaseClient['removeCommunity']> {
    throw new Error('unimplemented')
  }
  async banFromCommunity(
    ...params: Parameters<BaseClient['banFromCommunity']>
  ): ReturnType<BaseClient['banFromCommunity']> {
    throw new Error('unimplemented')
  }
  async addModToCommunity(
    ...params: Parameters<BaseClient['addModToCommunity']>
  ): ReturnType<BaseClient['addModToCommunity']> {
    throw new Error('unimplemented')
  }
  async markPostAsRead(
    params: Parameters<BaseClient['markPostAsRead']>[0],
  ): ReturnType<BaseClient['markPostAsRead']> {
    const response = await this.#client.POST('/post/mark_as_read', {
      body: { ...params },
    })

    // TODO remove any
    return response.data as any
  }
  async hidePost(
    ...params: Parameters<BaseClient['hidePost']>
  ): ReturnType<BaseClient['hidePost']> {
    throw new Error('unimplemented')
  }
  async lockPost(
    ...params: Parameters<BaseClient['lockPost']>
  ): ReturnType<BaseClient['lockPost']> {
    throw new Error('unimplemented')
  }
  async featurePost(
    ...params: Parameters<BaseClient['featurePost']>
  ): ReturnType<BaseClient['featurePost']> {
    throw new Error('unimplemented')
  }
  async listPostLikes(): ReturnType<BaseClient['listPostLikes']> {
    throw new Error('unsupported')
  }
  async savePost(
    params: Parameters<BaseClient['savePost']>[0],
  ): ReturnType<BaseClient['savePost']> {
    const response = (await this.#client.PUT('/post/save', { body: params }))
      .data!

    return {
      post_view: toPostView(response.post_view),
    }
  }
  async createPostReport(
    ...params: Parameters<BaseClient['createPostReport']>
  ): ReturnType<BaseClient['createPostReport']> {
    throw new Error('unimplemented')
  }
  async resolvePostReport(
    ...params: Parameters<BaseClient['resolvePostReport']>
  ): ReturnType<BaseClient['resolvePostReport']> {
    throw new Error('unimplemented')
  }
  async listPostReports(
    ...params: Parameters<BaseClient['listPostReports']>
  ): ReturnType<BaseClient['listPostReports']> {
    throw new Error('unimplemented')
  }
  async getSiteMetadata(
    ...params: Parameters<BaseClient['getSiteMetadata']>
  ): ReturnType<BaseClient['getSiteMetadata']> {
    throw new Error('unimplemented')
  }

  async createComment(
    params: Parameters<BaseClient['createComment']>[0],
  ): ReturnType<BaseClient['createComment']> {
    const response = (
      await this.#client.POST('/comment', {
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
    const response = (await this.#client.PUT('/comment', { body: params }))
      .data!

    return {
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async deleteComment(
    params: Parameters<BaseClient['deleteComment']>[0],
  ): ReturnType<BaseClient['deleteComment']> {
    const response = (
      await this.#client.POST('/comment/delete', { body: params })
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
      await this.#client.POST('/comment/remove', { body: params })
    ).data!

    return {
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async markCommentReplyAsRead(
    ...params: Parameters<BaseClient['markCommentReplyAsRead']>
  ): ReturnType<BaseClient['markCommentReplyAsRead']> {
    throw new Error('unimplemented')
  }
  async likeComment(
    params: Parameters<BaseClient['likeComment']>[0],
  ): ReturnType<BaseClient['likeComment']> {
    // TODO remove any
    return (await this.#client.POST('/comment/like', {
      body: params,
    })) as any
  }

  async listCommentLikes(): ReturnType<BaseClient['listCommentLikes']> {
    throw new Error('unsupported')
  }
  async saveComment(
    ...params: Parameters<BaseClient['saveComment']>
  ): ReturnType<BaseClient['saveComment']> {
    throw new Error('unimplemented')
  }
  async distinguishComment(
    ...params: Parameters<BaseClient['distinguishComment']>
  ): ReturnType<BaseClient['distinguishComment']> {
    throw new Error('unimplemented')
  }

  async getComments(
    params: Parameters<BaseClient['getComments']>[0],
  ): ReturnType<BaseClient['getComments']> {
    const response = (
      await this.#client.GET('/comment/list', {
        // @ts-expect-error same here what is happening
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
    const response =
      // @ts-expect-error same here what is happening
      (await this.#client.GET('/comment', { params: { query: params } })).data!

    return {
      ...response,
      comment_view: toCommentView(response.comment_view),
      recipient_ids: [],
    }
  }
  async createCommentReport(
    ...params: Parameters<BaseClient['createCommentReport']>
  ): ReturnType<BaseClient['createCommentReport']> {
    throw new Error('unimplemented')
  }
  async resolveCommentReport(
    ...params: Parameters<BaseClient['resolveCommentReport']>
  ): ReturnType<BaseClient['resolveCommentReport']> {
    throw new Error('unimplemented')
  }
  async listCommentReports(
    ...params: Parameters<BaseClient['listCommentReports']>
  ): ReturnType<BaseClient['listCommentReports']> {
    throw new Error('unimplemented')
  }
  async getPrivateMessages(
    params: Parameters<BaseClient['getPrivateMessages']>[0],
  ): ReturnType<BaseClient['getPrivateMessages']> {
    const response = (
      await this.#client.GET('/private_message/list', {
        // @ts-expect-error query params are screwed up
        params: { query: params },
      })
    ).data!

    return {
      private_messages: response.private_messages.map(toPrivateMessageView),
    }
  }
  async createPrivateMessage(
    ...params: Parameters<BaseClient['createPrivateMessage']>
  ): ReturnType<BaseClient['createPrivateMessage']> {
    throw new Error('unimplemented')
  }
  async editPrivateMessage(
    ...params: Parameters<BaseClient['editPrivateMessage']>
  ): ReturnType<BaseClient['editPrivateMessage']> {
    throw new Error('unimplemented')
  }
  async deletePrivateMessage(
    ...params: Parameters<BaseClient['deletePrivateMessage']>
  ): ReturnType<BaseClient['deletePrivateMessage']> {
    throw new Error('unimplemented')
  }
  async markPrivateMessageAsRead(
    ...params: Parameters<BaseClient['markPrivateMessageAsRead']>
  ): ReturnType<BaseClient['markPrivateMessageAsRead']> {
    throw new Error('unimplemented')
  }
  async createPrivateMessageReport(
    ...params: Parameters<BaseClient['createPrivateMessageReport']>
  ): ReturnType<BaseClient['createPrivateMessageReport']> {
    throw new Error('unimplemented')
  }
  async resolvePrivateMessageReport(
    ...params: Parameters<BaseClient['resolvePrivateMessageReport']>
  ): ReturnType<BaseClient['resolvePrivateMessageReport']> {
    throw new Error('unimplemented')
  }
  async listPrivateMessageReports(
    ...params: Parameters<BaseClient['listPrivateMessageReports']>
  ): ReturnType<BaseClient['listPrivateMessageReports']> {
    throw new Error('unimplemented')
  }
  async register(): ReturnType<BaseClient['register']> {
    throw new Error('unsupported')
  }
  async login(
    params: Parameters<BaseClient['login']>[0],
  ): ReturnType<BaseClient['login']> {
    const response = await this.#client.POST('/user/login', {
      body: { username: params.username_or_email, password: params.password },
    })!

    return {
      verify_email_sent: false,
      registration_created: false,
      jwt: response.data?.jwt,
    }
  }
  async logout(
    ...params: Parameters<BaseClient['logout']>
  ): ReturnType<BaseClient['logout']> {
    throw new Error('unimplemented')
  }
  async getPersonDetails(
    ...params: Parameters<BaseClient['getPersonDetails']>
  ): ReturnType<BaseClient['getPersonDetails']> {
    throw new Error('unimplemented')
  }
  async getPersonMentions(
    params: Parameters<BaseClient['getPersonMentions']>[0],
  ): ReturnType<BaseClient['getPersonMentions']> {
    const response = (
      await this.#client.GET('/user/mentions', {
        // @ts-expect-error yet another query param bug
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
    throw new Error('unimplemented')
  }
  async getReplies(
    params: Parameters<BaseClient['getReplies']>[0],
  ): ReturnType<BaseClient['getReplies']> {
    const response = (
      await this.#client.GET('/user/replies', {
        // @ts-expect-error same here what is happening
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
    const response = (await this.#client.POST('/user/block', { body: params }))
      .data!

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
    const response = (await this.#client.POST('/user/mark_all_as_read')).data!

    return {
      replies: response.replies.map(toCommentReplyView),
    }
  }
  async saveUserSettings(
    params: Parameters<BaseClient['saveUserSettings']>[0],
  ): ReturnType<BaseClient['saveUserSettings']> {
    return (
      await this.#client.PUT('/user/save_user_settings', { body: params })
    ).data!
  }
  async changePassword(): ReturnType<BaseClient['changePassword']> {
    throw new Error('unsupported')
  }
  async getReportCount(): ReturnType<BaseClient['getReportCount']> {
    throw new Error('unsupported')
  }
  async getUnreadCount(): ReturnType<BaseClient['getUnreadCount']> {
    return (await this.#client.GET('/user/unread_count')).data!
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
  async getFederatedInstances(
    ...params: Parameters<BaseClient['getFederatedInstances']>
  ): ReturnType<BaseClient['getFederatedInstances']> {
    throw new Error('unimplemented')
  }
  async blockInstance(
    params: Parameters<BaseClient['blockInstance']>[0],
  ): ReturnType<BaseClient['blockInstance']> {
    return (await this.#client.POST('/site/block', { body: { ...params } }))!
      .data!
  }
}
