import createClient from 'openapi-fetch'
import type { BaseClient } from '../base'
import {
  fromGetPosts,
  toLocalSite,
  toMyUser,
  toPersonView,
  toPostView,
} from './rewrite'
import type { paths } from './schema'

export class PiefedClient implements BaseClient {
  static type = { name: 'piefed', baseUrl: '/api/alpha' }

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
    // throw new Error('Unimplemented')

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
    ...params: Parameters<BaseClient['createPost']>
  ): ReturnType<BaseClient['createPost']> {
    throw new Error('Unimplemented')
  }
  async getPost(
    ...params: Parameters<BaseClient['getPost']>
  ): ReturnType<BaseClient['getPost']> {
    throw new Error('Unimplemented')
  }
  async editPost(
    ...params: Parameters<BaseClient['editPost']>
  ): ReturnType<BaseClient['editPost']> {
    throw new Error('Unimplemented')
  }
  async deletePost(
    ...params: Parameters<BaseClient['deletePost']>
  ): ReturnType<BaseClient['deletePost']> {
    throw new Error('Unimplemented')
  }
  async removePost(
    ...params: Parameters<BaseClient['removePost']>
  ): ReturnType<BaseClient['removePost']> {
    throw new Error('Unimplemented')
  }

  async getPosts(
    params: Parameters<BaseClient['getPosts']>[0],
  ): ReturnType<BaseClient['getPosts']> {
    const response = (
      await this.#client.GET('/post/list', {
        params: fromGetPosts(params),
      })
    ).data!

    return {
      posts: response.posts.map(toPostView),
      next_page: (Number(params.page_cursor ?? 1) + 1).toString(),
    }
  }
  async likePost(
    ...params: Parameters<BaseClient['likePost']>
  ): ReturnType<BaseClient['likePost']> {
    throw new Error('Unimplemented')
  }

  async generateTotpSecret(
    ...params: Parameters<BaseClient['generateTotpSecret']>
  ): ReturnType<BaseClient['generateTotpSecret']> {
    throw new Error('Unimplemented')
  }
  async listLogins(
    ...params: Parameters<BaseClient['listLogins']>
  ): ReturnType<BaseClient['listLogins']> {
    throw new Error('Unimplemented')
  }
  async listAllMedia(
    ...params: Parameters<BaseClient['listAllMedia']>
  ): ReturnType<BaseClient['listAllMedia']> {
    throw new Error('Unimplemented')
  }
  async updateTotp(
    ...params: Parameters<BaseClient['updateTotp']>
  ): ReturnType<BaseClient['updateTotp']> {
    throw new Error('Unimplemented')
  }
  async getModlog(
    ...params: Parameters<BaseClient['getModlog']>
  ): ReturnType<BaseClient['getModlog']> {
    throw new Error('Unimplemented')
  }
  async search(
    ...params: Parameters<BaseClient['search']>
  ): ReturnType<BaseClient['search']> {
    throw new Error('Unimplemented')
  }
  async resolveObject(
    ...params: Parameters<BaseClient['resolveObject']>
  ): ReturnType<BaseClient['resolveObject']> {
    throw new Error('Unimplemented')
  }
  async createCommunity(
    ...params: Parameters<BaseClient['createCommunity']>
  ): ReturnType<BaseClient['createCommunity']> {
    throw new Error('Unimplemented')
  }
  async getCommunity(
    ...params: Parameters<BaseClient['getCommunity']>
  ): ReturnType<BaseClient['getCommunity']> {
    throw new Error('Unimplemented')
  }
  async editCommunity(
    ...params: Parameters<BaseClient['editCommunity']>
  ): ReturnType<BaseClient['editCommunity']> {
    throw new Error('Unimplemented')
  }
  async listCommunities(
    ...params: Parameters<BaseClient['listCommunities']>
  ): ReturnType<BaseClient['listCommunities']> {
    throw new Error('Unimplemented')
  }
  async followCommunity(
    ...params: Parameters<BaseClient['followCommunity']>
  ): ReturnType<BaseClient['followCommunity']> {
    throw new Error('Unimplemented')
  }
  async blockCommunity(
    ...params: Parameters<BaseClient['blockCommunity']>
  ): ReturnType<BaseClient['blockCommunity']> {
    throw new Error('Unimplemented')
  }
  async deleteCommunity(
    ...params: Parameters<BaseClient['deleteCommunity']>
  ): ReturnType<BaseClient['deleteCommunity']> {
    throw new Error('Unimplemented')
  }
  async hideCommunity(
    ...params: Parameters<BaseClient['hideCommunity']>
  ): ReturnType<BaseClient['hideCommunity']> {
    throw new Error('Unimplemented')
  }
  async removeCommunity(
    ...params: Parameters<BaseClient['removeCommunity']>
  ): ReturnType<BaseClient['removeCommunity']> {
    throw new Error('Unimplemented')
  }
  async banFromCommunity(
    ...params: Parameters<BaseClient['banFromCommunity']>
  ): ReturnType<BaseClient['banFromCommunity']> {
    throw new Error('Unimplemented')
  }
  async addModToCommunity(
    ...params: Parameters<BaseClient['addModToCommunity']>
  ): ReturnType<BaseClient['addModToCommunity']> {
    throw new Error('Unimplemented')
  }
  async markPostAsRead(
    ...params: Parameters<BaseClient['markPostAsRead']>
  ): ReturnType<BaseClient['markPostAsRead']> {
    throw new Error('Unimplemented')
  }
  async hidePost(
    ...params: Parameters<BaseClient['hidePost']>
  ): ReturnType<BaseClient['hidePost']> {
    throw new Error('Unimplemented')
  }
  async lockPost(
    ...params: Parameters<BaseClient['lockPost']>
  ): ReturnType<BaseClient['lockPost']> {
    throw new Error('Unimplemented')
  }
  async featurePost(
    ...params: Parameters<BaseClient['featurePost']>
  ): ReturnType<BaseClient['featurePost']> {
    throw new Error('Unimplemented')
  }
  async listPostLikes(
    ...params: Parameters<BaseClient['listPostLikes']>
  ): ReturnType<BaseClient['listPostLikes']> {
    throw new Error('Unimplemented')
  }
  async savePost(
    ...params: Parameters<BaseClient['savePost']>
  ): ReturnType<BaseClient['savePost']> {
    throw new Error('Unimplemented')
  }
  async createPostReport(
    ...params: Parameters<BaseClient['createPostReport']>
  ): ReturnType<BaseClient['createPostReport']> {
    throw new Error('Unimplemented')
  }
  async resolvePostReport(
    ...params: Parameters<BaseClient['resolvePostReport']>
  ): ReturnType<BaseClient['resolvePostReport']> {
    throw new Error('Unimplemented')
  }
  async listPostReports(
    ...params: Parameters<BaseClient['listPostReports']>
  ): ReturnType<BaseClient['listPostReports']> {
    throw new Error('Unimplemented')
  }
  async getSiteMetadata(
    ...params: Parameters<BaseClient['getSiteMetadata']>
  ): ReturnType<BaseClient['getSiteMetadata']> {
    throw new Error('Unimplemented')
  }
  async createComment(
    ...params: Parameters<BaseClient['createComment']>
  ): ReturnType<BaseClient['createComment']> {
    throw new Error('Unimplemented')
  }
  async editComment(
    ...params: Parameters<BaseClient['editComment']>
  ): ReturnType<BaseClient['editComment']> {
    throw new Error('Unimplemented')
  }
  async deleteComment(
    ...params: Parameters<BaseClient['deleteComment']>
  ): ReturnType<BaseClient['deleteComment']> {
    throw new Error('Unimplemented')
  }
  async removeComment(
    ...params: Parameters<BaseClient['removeComment']>
  ): ReturnType<BaseClient['removeComment']> {
    throw new Error('Unimplemented')
  }
  async markCommentReplyAsRead(
    ...params: Parameters<BaseClient['markCommentReplyAsRead']>
  ): ReturnType<BaseClient['markCommentReplyAsRead']> {
    throw new Error('Unimplemented')
  }
  async likeComment(
    ...params: Parameters<BaseClient['likeComment']>
  ): ReturnType<BaseClient['likeComment']> {
    throw new Error('Unimplemented')
  }
  async listCommentLikes(
    ...params: Parameters<BaseClient['listCommentLikes']>
  ): ReturnType<BaseClient['listCommentLikes']> {
    throw new Error('Unimplemented')
  }
  async saveComment(
    ...params: Parameters<BaseClient['saveComment']>
  ): ReturnType<BaseClient['saveComment']> {
    throw new Error('Unimplemented')
  }
  async distinguishComment(
    ...params: Parameters<BaseClient['distinguishComment']>
  ): ReturnType<BaseClient['distinguishComment']> {
    throw new Error('Unimplemented')
  }
  async getComments(
    ...params: Parameters<BaseClient['getComments']>
  ): ReturnType<BaseClient['getComments']> {
    throw new Error('Unimplemented')
  }
  async getComment(
    ...params: Parameters<BaseClient['getComment']>
  ): ReturnType<BaseClient['getComment']> {
    throw new Error('Unimplemented')
  }
  async createCommentReport(
    ...params: Parameters<BaseClient['createCommentReport']>
  ): ReturnType<BaseClient['createCommentReport']> {
    throw new Error('Unimplemented')
  }
  async resolveCommentReport(
    ...params: Parameters<BaseClient['resolveCommentReport']>
  ): ReturnType<BaseClient['resolveCommentReport']> {
    throw new Error('Unimplemented')
  }
  async listCommentReports(
    ...params: Parameters<BaseClient['listCommentReports']>
  ): ReturnType<BaseClient['listCommentReports']> {
    throw new Error('Unimplemented')
  }
  async getPrivateMessages(
    ...params: Parameters<BaseClient['getPrivateMessages']>
  ): ReturnType<BaseClient['getPrivateMessages']> {
    throw new Error('Unimplemented')
  }
  async createPrivateMessage(
    ...params: Parameters<BaseClient['createPrivateMessage']>
  ): ReturnType<BaseClient['createPrivateMessage']> {
    throw new Error('Unimplemented')
  }
  async editPrivateMessage(
    ...params: Parameters<BaseClient['editPrivateMessage']>
  ): ReturnType<BaseClient['editPrivateMessage']> {
    throw new Error('Unimplemented')
  }
  async deletePrivateMessage(
    ...params: Parameters<BaseClient['deletePrivateMessage']>
  ): ReturnType<BaseClient['deletePrivateMessage']> {
    throw new Error('Unimplemented')
  }
  async markPrivateMessageAsRead(
    ...params: Parameters<BaseClient['markPrivateMessageAsRead']>
  ): ReturnType<BaseClient['markPrivateMessageAsRead']> {
    throw new Error('Unimplemented')
  }
  async createPrivateMessageReport(
    ...params: Parameters<BaseClient['createPrivateMessageReport']>
  ): ReturnType<BaseClient['createPrivateMessageReport']> {
    throw new Error('Unimplemented')
  }
  async resolvePrivateMessageReport(
    ...params: Parameters<BaseClient['resolvePrivateMessageReport']>
  ): ReturnType<BaseClient['resolvePrivateMessageReport']> {
    throw new Error('Unimplemented')
  }
  async listPrivateMessageReports(
    ...params: Parameters<BaseClient['listPrivateMessageReports']>
  ): ReturnType<BaseClient['listPrivateMessageReports']> {
    throw new Error('Unimplemented')
  }
  async register(
    ...params: Parameters<BaseClient['register']>
  ): ReturnType<BaseClient['register']> {
    throw new Error('Unimplemented')
  }
  async login(
    ...params: Parameters<BaseClient['login']>
  ): ReturnType<BaseClient['login']> {
    throw new Error('Unimplemented')
  }
  async logout(
    ...params: Parameters<BaseClient['logout']>
  ): ReturnType<BaseClient['logout']> {
    throw new Error('Unimplemented')
  }
  async getPersonDetails(
    ...params: Parameters<BaseClient['getPersonDetails']>
  ): ReturnType<BaseClient['getPersonDetails']> {
    throw new Error('Unimplemented')
  }
  async getPersonMentions(
    ...params: Parameters<BaseClient['getPersonMentions']>
  ): ReturnType<BaseClient['getPersonMentions']> {
    throw new Error('Unimplemented')
  }
  async markPersonMentionAsRead(
    ...params: Parameters<BaseClient['markPersonMentionAsRead']>
  ): ReturnType<BaseClient['markPersonMentionAsRead']> {
    throw new Error('Unimplemented')
  }
  async getReplies(
    ...params: Parameters<BaseClient['getReplies']>
  ): ReturnType<BaseClient['getReplies']> {
    throw new Error('Unimplemented')
  }
  async banPerson(
    ...params: Parameters<BaseClient['banPerson']>
  ): ReturnType<BaseClient['banPerson']> {
    throw new Error('Unimplemented')
  }
  async getBannedPersons(
    ...params: Parameters<BaseClient['getBannedPersons']>
  ): ReturnType<BaseClient['getBannedPersons']> {
    throw new Error('Unimplemented')
  }
  async blockPerson(
    ...params: Parameters<BaseClient['blockPerson']>
  ): ReturnType<BaseClient['blockPerson']> {
    throw new Error('Unimplemented')
  }
  async getCaptcha(
    ...params: Parameters<BaseClient['getCaptcha']>
  ): ReturnType<BaseClient['getCaptcha']> {
    throw new Error('Unimplemented')
  }
  async deleteAccount(
    ...params: Parameters<BaseClient['deleteAccount']>
  ): ReturnType<BaseClient['deleteAccount']> {
    throw new Error('Unimplemented')
  }
  async passwordReset(
    ...params: Parameters<BaseClient['passwordReset']>
  ): ReturnType<BaseClient['passwordReset']> {
    throw new Error('Unimplemented')
  }
  async passwordChangeAfterReset(
    ...params: Parameters<BaseClient['passwordChangeAfterReset']>
  ): ReturnType<BaseClient['passwordChangeAfterReset']> {
    throw new Error('Unimplemented')
  }
  async markAllAsRead(
    ...params: Parameters<BaseClient['markAllAsRead']>
  ): ReturnType<BaseClient['markAllAsRead']> {
    throw new Error('Unimplemented')
  }
  async saveUserSettings(
    ...params: Parameters<BaseClient['saveUserSettings']>
  ): ReturnType<BaseClient['saveUserSettings']> {
    throw new Error('Unimplemented')
  }
  async changePassword(
    ...params: Parameters<BaseClient['changePassword']>
  ): ReturnType<BaseClient['changePassword']> {
    throw new Error('Unimplemented')
  }
  async getReportCount(
    ...params: Parameters<BaseClient['getReportCount']>
  ): ReturnType<BaseClient['getReportCount']> {
    throw new Error('Unimplemented')
  }
  async getUnreadCount(
    ...params: Parameters<BaseClient['getUnreadCount']>
  ): ReturnType<BaseClient['getUnreadCount']> {
    throw new Error('Unimplemented')
  }
  async verifyEmail(
    ...params: Parameters<BaseClient['verifyEmail']>
  ): ReturnType<BaseClient['verifyEmail']> {
    throw new Error('Unimplemented')
  }
  async addAdmin(
    ...params: Parameters<BaseClient['addAdmin']>
  ): ReturnType<BaseClient['addAdmin']> {
    throw new Error('Unimplemented')
  }
  async getUnreadRegistrationApplicationCount(
    ...params: Parameters<BaseClient['getUnreadRegistrationApplicationCount']>
  ): ReturnType<BaseClient['getUnreadRegistrationApplicationCount']> {
    throw new Error('Unimplemented')
  }
  async listRegistrationApplications(
    ...params: Parameters<BaseClient['listRegistrationApplications']>
  ): ReturnType<BaseClient['listRegistrationApplications']> {
    throw new Error('Unimplemented')
  }
  async approveRegistrationApplication(
    ...params: Parameters<BaseClient['approveRegistrationApplication']>
  ): ReturnType<BaseClient['approveRegistrationApplication']> {
    throw new Error('Unimplemented')
  }
  async getRegistrationApplication(
    ...params: Parameters<BaseClient['getRegistrationApplication']>
  ): ReturnType<BaseClient['getRegistrationApplication']> {
    throw new Error('Unimplemented')
  }
  async purgePerson(
    ...params: Parameters<BaseClient['purgePerson']>
  ): ReturnType<BaseClient['purgePerson']> {
    throw new Error('Unimplemented')
  }
  async purgeCommunity(
    ...params: Parameters<BaseClient['purgeCommunity']>
  ): ReturnType<BaseClient['purgeCommunity']> {
    throw new Error('Unimplemented')
  }
  async purgePost(
    ...params: Parameters<BaseClient['purgePost']>
  ): ReturnType<BaseClient['purgePost']> {
    throw new Error('Unimplemented')
  }
  async purgeComment(
    ...params: Parameters<BaseClient['purgeComment']>
  ): ReturnType<BaseClient['purgeComment']> {
    throw new Error('Unimplemented')
  }
  async getFederatedInstances(
    ...params: Parameters<BaseClient['getFederatedInstances']>
  ): ReturnType<BaseClient['getFederatedInstances']> {
    throw new Error('Unimplemented')
  }
  async blockInstance(
    ...params: Parameters<BaseClient['blockInstance']>
  ): ReturnType<BaseClient['blockInstance']> {
    throw new Error('Unimplemented')
  }
}
