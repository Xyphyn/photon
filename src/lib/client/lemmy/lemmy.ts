import { LemmyHttp } from 'lemmy-js-client'
import type { BaseClient } from '../base'
import { fromGetPosts, toListingType } from './rewrite'
import type { ClientType } from '../lemmy.svelte'

export class LemmyClient implements BaseClient {
  type: ClientType = { name: 'lemmy', baseUrl: '/api/v3' }

  #client: LemmyHttp

  constructor(
    baseUrl: string,
    args: {
      fetchFunction: (input: any, init: any) => Promise<any>
      headers: any
    },
  ) {
    this.#client = new LemmyHttp(baseUrl, args)
  }

  async getSite(
    ...params: Parameters<BaseClient['getSite']>
  ): ReturnType<BaseClient['getSite']> {
    return await this.#client.getSite(...params)
  }
  async generateTotpSecret(
    ...params: Parameters<BaseClient['generateTotpSecret']>
  ): ReturnType<BaseClient['generateTotpSecret']> {
    return await this.#client.generateTotpSecret(...params)
  }
  async listLogins(
    ...params: Parameters<BaseClient['listLogins']>
  ): ReturnType<BaseClient['listLogins']> {
    return await this.#client.listLogins(...params)
  }
  async listAllMedia(
    ...params: Parameters<BaseClient['listAllMedia']>
  ): ReturnType<BaseClient['listAllMedia']> {
    return await this.#client.listAllMedia(...params)
  }
  async updateTotp(
    ...params: Parameters<BaseClient['updateTotp']>
  ): ReturnType<BaseClient['updateTotp']> {
    return await this.#client.updateTotp(...params)
  }
  async getModlog(
    ...params: Parameters<BaseClient['getModlog']>
  ): ReturnType<BaseClient['getModlog']> {
    return await this.#client.getModlog(...params)
  }
  async search(
    params: Parameters<BaseClient['search']>[0],
  ): ReturnType<BaseClient['search']> {
    return await this.#client.search({
      ...params,
      listing_type: toListingType(params.listing_type),
    })
  }
  async resolveObject(
    ...params: Parameters<BaseClient['resolveObject']>
  ): ReturnType<BaseClient['resolveObject']> {
    return await this.#client.resolveObject(...params)
  }
  async createCommunity(
    ...params: Parameters<BaseClient['createCommunity']>
  ): ReturnType<BaseClient['createCommunity']> {
    return await this.#client.createCommunity(...params)
  }
  async getCommunity(
    ...params: Parameters<BaseClient['getCommunity']>
  ): ReturnType<BaseClient['getCommunity']> {
    return await this.#client.getCommunity(...params)
  }
  async editCommunity(
    ...params: Parameters<BaseClient['editCommunity']>
  ): ReturnType<BaseClient['editCommunity']> {
    return await this.#client.editCommunity(...params)
  }
  async listCommunities(
    params: Parameters<BaseClient['listCommunities']>[0],
  ): ReturnType<BaseClient['listCommunities']> {
    return await this.#client.listCommunities({
      ...params,
      type_: toListingType(params.type_),
    })
  }
  async followCommunity(
    ...params: Parameters<BaseClient['followCommunity']>
  ): ReturnType<BaseClient['followCommunity']> {
    return await this.#client.followCommunity(...params)
  }
  async blockCommunity(
    ...params: Parameters<BaseClient['blockCommunity']>
  ): ReturnType<BaseClient['blockCommunity']> {
    return await this.#client.blockCommunity(...params)
  }
  async deleteCommunity(
    ...params: Parameters<BaseClient['deleteCommunity']>
  ): ReturnType<BaseClient['deleteCommunity']> {
    return await this.#client.deleteCommunity(...params)
  }
  async hideCommunity(
    ...params: Parameters<BaseClient['hideCommunity']>
  ): ReturnType<BaseClient['hideCommunity']> {
    return await this.#client.hideCommunity(...params)
  }
  async removeCommunity(
    ...params: Parameters<BaseClient['removeCommunity']>
  ): ReturnType<BaseClient['removeCommunity']> {
    return await this.#client.removeCommunity(...params)
  }
  async banFromCommunity(
    ...params: Parameters<BaseClient['banFromCommunity']>
  ): ReturnType<BaseClient['banFromCommunity']> {
    return await this.#client.banFromCommunity(...params)
  }
  async addModToCommunity(
    ...params: Parameters<BaseClient['addModToCommunity']>
  ): ReturnType<BaseClient['addModToCommunity']> {
    return await this.#client.addModToCommunity(...params)
  }
  async createPost(
    ...params: Parameters<BaseClient['createPost']>
  ): ReturnType<BaseClient['createPost']> {
    return await this.#client.createPost(...params)
  }
  async getPost(
    ...params: Parameters<BaseClient['getPost']>
  ): ReturnType<BaseClient['getPost']> {
    return await this.#client.getPost(...params)
  }
  async editPost(
    ...params: Parameters<BaseClient['editPost']>
  ): ReturnType<BaseClient['editPost']> {
    return await this.#client.editPost(...params)
  }
  async deletePost(
    ...params: Parameters<BaseClient['deletePost']>
  ): ReturnType<BaseClient['deletePost']> {
    return await this.#client.deletePost(...params)
  }
  async removePost(
    ...params: Parameters<BaseClient['removePost']>
  ): ReturnType<BaseClient['removePost']> {
    return await this.#client.removePost(...params)
  }
  async markPostAsRead(
    ...params: Parameters<BaseClient['markPostAsRead']>
  ): ReturnType<BaseClient['markPostAsRead']> {
    return await this.#client.markPostAsRead(...params)
  }
  async hidePost(
    ...params: Parameters<BaseClient['hidePost']>
  ): ReturnType<BaseClient['hidePost']> {
    return await this.#client.hidePost(...params)
  }
  async lockPost(
    ...params: Parameters<BaseClient['lockPost']>
  ): ReturnType<BaseClient['lockPost']> {
    return await this.#client.lockPost(...params)
  }
  async featurePost(
    ...params: Parameters<BaseClient['featurePost']>
  ): ReturnType<BaseClient['featurePost']> {
    return await this.#client.featurePost(...params)
  }
  async getPosts(
    params: Parameters<BaseClient['getPosts']>[0],
  ): ReturnType<BaseClient['getPosts']> {
    return await this.#client.getPosts(fromGetPosts(params))
  }
  async likePost(
    ...params: Parameters<BaseClient['likePost']>
  ): ReturnType<BaseClient['likePost']> {
    return await this.#client.likePost(...params)
  }
  async listPostLikes(
    ...params: Parameters<BaseClient['listPostLikes']>
  ): ReturnType<BaseClient['listPostLikes']> {
    return await this.#client.listPostLikes(...params)
  }
  async savePost(
    ...params: Parameters<BaseClient['savePost']>
  ): ReturnType<BaseClient['savePost']> {
    return await this.#client.savePost(...params)
  }
  async createPostReport(
    ...params: Parameters<BaseClient['createPostReport']>
  ): ReturnType<BaseClient['createPostReport']> {
    return await this.#client.createPostReport(...params)
  }
  async resolvePostReport(
    ...params: Parameters<BaseClient['resolvePostReport']>
  ): ReturnType<BaseClient['resolvePostReport']> {
    return await this.#client.resolvePostReport(...params)
  }
  async listPostReports(
    ...params: Parameters<BaseClient['listPostReports']>
  ): ReturnType<BaseClient['listPostReports']> {
    return await this.#client.listPostReports(...params)
  }
  async getSiteMetadata(
    ...params: Parameters<BaseClient['getSiteMetadata']>
  ): ReturnType<BaseClient['getSiteMetadata']> {
    return await this.#client.getSiteMetadata(...params)
  }
  async createComment(
    ...params: Parameters<BaseClient['createComment']>
  ): ReturnType<BaseClient['createComment']> {
    return await this.#client.createComment(...params)
  }
  async editComment(
    ...params: Parameters<BaseClient['editComment']>
  ): ReturnType<BaseClient['editComment']> {
    return await this.#client.editComment(...params)
  }
  async deleteComment(
    ...params: Parameters<BaseClient['deleteComment']>
  ): ReturnType<BaseClient['deleteComment']> {
    return await this.#client.deleteComment(...params)
  }
  async removeComment(
    ...params: Parameters<BaseClient['removeComment']>
  ): ReturnType<BaseClient['removeComment']> {
    return await this.#client.removeComment(...params)
  }
  async markCommentReplyAsRead(
    ...params: Parameters<BaseClient['markCommentReplyAsRead']>
  ): ReturnType<BaseClient['markCommentReplyAsRead']> {
    return await this.#client.markCommentReplyAsRead(...params)
  }
  async likeComment(
    ...params: Parameters<BaseClient['likeComment']>
  ): ReturnType<BaseClient['likeComment']> {
    return await this.#client.likeComment(...params)
  }
  async listCommentLikes(
    ...params: Parameters<BaseClient['listCommentLikes']>
  ): ReturnType<BaseClient['listCommentLikes']> {
    return await this.#client.listCommentLikes(...params)
  }
  async saveComment(
    ...params: Parameters<BaseClient['saveComment']>
  ): ReturnType<BaseClient['saveComment']> {
    return await this.#client.saveComment(...params)
  }
  async distinguishComment(
    ...params: Parameters<BaseClient['distinguishComment']>
  ): ReturnType<BaseClient['distinguishComment']> {
    return await this.#client.distinguishComment(...params)
  }
  async getComments(
    params: Parameters<BaseClient['getComments']>[0],
  ): ReturnType<BaseClient['getComments']> {
    return await this.#client.getComments({
      ...params,
      type_: toListingType(params.type_),
    })
  }
  async getComment(
    ...params: Parameters<BaseClient['getComment']>
  ): ReturnType<BaseClient['getComment']> {
    return await this.#client.getComment(...params)
  }
  async createCommentReport(
    ...params: Parameters<BaseClient['createCommentReport']>
  ): ReturnType<BaseClient['createCommentReport']> {
    return await this.#client.createCommentReport(...params)
  }
  async resolveCommentReport(
    ...params: Parameters<BaseClient['resolveCommentReport']>
  ): ReturnType<BaseClient['resolveCommentReport']> {
    return await this.#client.resolveCommentReport(...params)
  }
  async listCommentReports(
    ...params: Parameters<BaseClient['listCommentReports']>
  ): ReturnType<BaseClient['listCommentReports']> {
    return await this.#client.listCommentReports(...params)
  }
  async getPrivateMessages(
    ...params: Parameters<BaseClient['getPrivateMessages']>
  ): ReturnType<BaseClient['getPrivateMessages']> {
    return await this.#client.getPrivateMessages(...params)
  }
  async createPrivateMessage(
    ...params: Parameters<BaseClient['createPrivateMessage']>
  ): ReturnType<BaseClient['createPrivateMessage']> {
    return await this.#client.createPrivateMessage(...params)
  }
  async editPrivateMessage(
    ...params: Parameters<BaseClient['editPrivateMessage']>
  ): ReturnType<BaseClient['editPrivateMessage']> {
    return await this.#client.editPrivateMessage(...params)
  }
  async deletePrivateMessage(
    ...params: Parameters<BaseClient['deletePrivateMessage']>
  ): ReturnType<BaseClient['deletePrivateMessage']> {
    return await this.#client.deletePrivateMessage(...params)
  }
  async markPrivateMessageAsRead(
    ...params: Parameters<BaseClient['markPrivateMessageAsRead']>
  ): ReturnType<BaseClient['markPrivateMessageAsRead']> {
    return await this.#client.markPrivateMessageAsRead(...params)
  }
  async createPrivateMessageReport(
    ...params: Parameters<BaseClient['createPrivateMessageReport']>
  ): ReturnType<BaseClient['createPrivateMessageReport']> {
    return await this.#client.createPrivateMessageReport(...params)
  }
  async resolvePrivateMessageReport(
    ...params: Parameters<BaseClient['resolvePrivateMessageReport']>
  ): ReturnType<BaseClient['resolvePrivateMessageReport']> {
    return await this.#client.resolvePrivateMessageReport(...params)
  }
  async listPrivateMessageReports(
    ...params: Parameters<BaseClient['listPrivateMessageReports']>
  ): ReturnType<BaseClient['listPrivateMessageReports']> {
    return await this.#client.listPrivateMessageReports(...params)
  }
  async register(
    ...params: Parameters<BaseClient['register']>
  ): ReturnType<BaseClient['register']> {
    return await this.#client.register(...params)
  }
  async login(
    ...params: Parameters<BaseClient['login']>
  ): ReturnType<BaseClient['login']> {
    return await this.#client.login(...params)
  }
  async logout(
    ...params: Parameters<BaseClient['logout']>
  ): ReturnType<BaseClient['logout']> {
    return await this.#client.logout(...params)
  }
  async getPersonDetails(
    ...params: Parameters<BaseClient['getPersonDetails']>
  ): ReturnType<BaseClient['getPersonDetails']> {
    return await this.#client.getPersonDetails(...params)
  }
  async getPersonMentions(
    ...params: Parameters<BaseClient['getPersonMentions']>
  ): ReturnType<BaseClient['getPersonMentions']> {
    return await this.#client.getPersonMentions(...params)
  }
  async markPersonMentionAsRead(
    ...params: Parameters<BaseClient['markPersonMentionAsRead']>
  ): ReturnType<BaseClient['markPersonMentionAsRead']> {
    return await this.#client.markPersonMentionAsRead(...params)
  }
  async getReplies(
    ...params: Parameters<BaseClient['getReplies']>
  ): ReturnType<BaseClient['getReplies']> {
    return await this.#client.getReplies(...params)
  }
  async banPerson(
    ...params: Parameters<BaseClient['banPerson']>
  ): ReturnType<BaseClient['banPerson']> {
    return await this.#client.banPerson(...params)
  }
  async getBannedPersons(
    ...params: Parameters<BaseClient['getBannedPersons']>
  ): ReturnType<BaseClient['getBannedPersons']> {
    return await this.#client.getBannedPersons(...params)
  }
  async blockPerson(
    ...params: Parameters<BaseClient['blockPerson']>
  ): ReturnType<BaseClient['blockPerson']> {
    return await this.#client.blockPerson(...params)
  }
  async getCaptcha(
    ...params: Parameters<BaseClient['getCaptcha']>
  ): ReturnType<BaseClient['getCaptcha']> {
    return await this.#client.getCaptcha(...params)
  }
  async deleteAccount(
    ...params: Parameters<BaseClient['deleteAccount']>
  ): ReturnType<BaseClient['deleteAccount']> {
    return await this.#client.deleteAccount(...params)
  }
  async passwordReset(
    ...params: Parameters<BaseClient['passwordReset']>
  ): ReturnType<BaseClient['passwordReset']> {
    return await this.#client.passwordReset(...params)
  }
  async passwordChangeAfterReset(
    ...params: Parameters<BaseClient['passwordChangeAfterReset']>
  ): ReturnType<BaseClient['passwordChangeAfterReset']> {
    return await this.#client.passwordChangeAfterReset(...params)
  }
  async markAllAsRead(
    ...params: Parameters<BaseClient['markAllAsRead']>
  ): ReturnType<BaseClient['markAllAsRead']> {
    return await this.#client.markAllAsRead(...params)
  }
  async saveUserSettings(
    ...params: Parameters<BaseClient['saveUserSettings']>
  ): ReturnType<BaseClient['saveUserSettings']> {
    return await this.#client.saveUserSettings(...params)
  }
  async changePassword(
    ...params: Parameters<BaseClient['changePassword']>
  ): ReturnType<BaseClient['changePassword']> {
    return await this.#client.changePassword(...params)
  }
  async getReportCount(
    ...params: Parameters<BaseClient['getReportCount']>
  ): ReturnType<BaseClient['getReportCount']> {
    return await this.#client.getReportCount(...params)
  }
  async getUnreadCount(
    ...params: Parameters<BaseClient['getUnreadCount']>
  ): ReturnType<BaseClient['getUnreadCount']> {
    return await this.#client.getUnreadCount(...params)
  }
  async verifyEmail(
    ...params: Parameters<BaseClient['verifyEmail']>
  ): ReturnType<BaseClient['verifyEmail']> {
    return await this.#client.verifyEmail(...params)
  }
  async addAdmin(
    ...params: Parameters<BaseClient['addAdmin']>
  ): ReturnType<BaseClient['addAdmin']> {
    return await this.#client.addAdmin(...params)
  }
  async getUnreadRegistrationApplicationCount(
    ...params: Parameters<BaseClient['getUnreadRegistrationApplicationCount']>
  ): ReturnType<BaseClient['getUnreadRegistrationApplicationCount']> {
    return await this.#client.getUnreadRegistrationApplicationCount(...params)
  }
  async listRegistrationApplications(
    ...params: Parameters<BaseClient['listRegistrationApplications']>
  ): ReturnType<BaseClient['listRegistrationApplications']> {
    return await this.#client.listRegistrationApplications(...params)
  }
  async approveRegistrationApplication(
    ...params: Parameters<BaseClient['approveRegistrationApplication']>
  ): ReturnType<BaseClient['approveRegistrationApplication']> {
    return await this.#client.approveRegistrationApplication(...params)
  }
  async getRegistrationApplication(
    ...params: Parameters<BaseClient['getRegistrationApplication']>
  ): ReturnType<BaseClient['getRegistrationApplication']> {
    return await this.#client.getRegistrationApplication(...params)
  }
  async purgePerson(
    ...params: Parameters<BaseClient['purgePerson']>
  ): ReturnType<BaseClient['purgePerson']> {
    return await this.#client.purgePerson(...params)
  }
  async purgeCommunity(
    ...params: Parameters<BaseClient['purgeCommunity']>
  ): ReturnType<BaseClient['purgeCommunity']> {
    return await this.#client.purgeCommunity(...params)
  }
  async purgePost(
    ...params: Parameters<BaseClient['purgePost']>
  ): ReturnType<BaseClient['purgePost']> {
    return await this.#client.purgePost(...params)
  }
  async purgeComment(
    ...params: Parameters<BaseClient['purgeComment']>
  ): ReturnType<BaseClient['purgeComment']> {
    return await this.#client.purgeComment(...params)
  }
  async getFederatedInstances(
    ...params: Parameters<BaseClient['getFederatedInstances']>
  ): ReturnType<BaseClient['getFederatedInstances']> {
    return await this.#client.getFederatedInstances(...params)
  }
  async blockInstance(
    ...params: Parameters<BaseClient['blockInstance']>
  ): ReturnType<BaseClient['blockInstance']> {
    return await this.#client.blockInstance(...params)
  }
}
