import { env } from '$env/dynamic/public'
import * as types from './types'

export type ClientType =
  | { name: 'lemmy'; baseUrl: '/api/v3' }
  | { name: 'piefed'; baseUrl: '/api/alpha' }

export const DEFAULT_CLIENT_TYPE: ClientType =
  env.PUBLIC_INSTANCE_TYPE == 'piefedalpha'
    ? {
        name: 'piefed',
        baseUrl: '/api/alpha',
      }
    : {
        name: 'lemmy',
        baseUrl: '/api/v3',
      }

export abstract class BaseClient {
  abstract type: ClientType

  static constants: {
    password: {
      minLength: number
      maxLength: number
    }
  }

  static async fetchInfo(
    base: string,
  ): Promise<{ type: ClientType; version: string } | null> {
    try {
      const res = await fetch(new URL('/nodeinfo/2.1', base))

      if (!res.ok) return null

      const software: { name: string; version: string } = (await res.json())
        .software

      // should probably extract this into not a static function but its ok
      switch (software.name) {
        case 'lemmy': {
          return {
            type: { baseUrl: '/api/v3', name: 'lemmy' },
            version: software.version,
          }
        }
        case 'piefed': {
          return {
            type: { baseUrl: '/api/alpha', name: 'piefed' },
            version: software.version,
          }
        }
        default:
          return null
      }
    } catch (err) {
      console.error(err)
      return null
    }
  }

  abstract getSite(): Promise<types.GetSiteResponse>
  abstract editSite(form: types.EditSite): Promise<types.SiteResponse>
  abstract generateTotpSecret(): Promise<types.GenerateTotpSecretResponse>
  abstract listLogins(): Promise<types.LoginToken[]>
  abstract listAllMedia(form: types.ListMedia): Promise<types.ListMediaResponse>
  abstract updateTotp(form: types.UpdateTotp): Promise<types.UpdateTotpResponse>
  abstract getModlog(form: types.GetModlog): Promise<types.GetModlogResponse>
  abstract search(form: types.Search): Promise<types.SearchResponse>
  abstract resolveObject(
    form: types.ResolveObject,
  ): Promise<types.ResolveObjectResponse>
  abstract createCommunity(
    form: types.CreateCommunity,
  ): Promise<types.CommunityResponse>
  abstract getCommunity(
    form: types.GetCommunity,
  ): Promise<types.GetCommunityResponse>
  abstract editCommunity(
    form: types.EditCommunity,
  ): Promise<types.CommunityResponse>
  abstract listCommunities(
    form: types.ListCommunities,
  ): Promise<types.ListCommunitiesResponse>
  abstract followCommunity(
    form: types.FollowCommunity,
  ): Promise<types.CommunityResponse>
  abstract blockCommunity(
    form: types.BlockCommunity,
  ): Promise<types.BlockCommunityResponse>
  abstract deleteCommunity(
    form: types.DeleteCommunity,
  ): Promise<types.CommunityResponse>
  abstract hideCommunity(
    form: types.HideCommunity,
  ): Promise<types.SuccessResponse>
  abstract removeCommunity(
    form: types.RemoveCommunity,
  ): Promise<types.CommunityResponse>
  abstract banFromCommunity(
    form: types.BanFromCommunity,
  ): Promise<types.BanFromCommunityResponse>
  abstract addModToCommunity(
    form: types.AddModToCommunity,
  ): Promise<types.AddModToCommunityResponse>
  abstract createPost(form: types.CreatePost): Promise<types.PostResponse>
  abstract getPost(form: types.GetPost): Promise<types.GetPostResponse>
  abstract editPost(form: types.EditPost): Promise<types.PostResponse>
  abstract deletePost(form: types.DeletePost): Promise<types.PostResponse>
  abstract removePost(form: types.RemovePost): Promise<types.PostResponse>
  abstract markPostAsRead(
    form: types.MarkPostAsRead,
  ): Promise<types.SuccessResponse>
  abstract hidePost(form: types.HidePost): Promise<types.SuccessResponse>
  abstract lockPost(form: types.LockPost): Promise<types.PostResponse>
  abstract featurePost(form: types.FeaturePost): Promise<types.PostResponse>
  abstract getPosts(form: types.GetPosts): Promise<types.GetPostsResponse>
  abstract likePost(form: types.CreatePostLike): Promise<types.PostResponse>
  abstract listPostLikes(
    form: types.ListPostLikes,
  ): Promise<types.ListPostLikesResponse>
  abstract savePost(form: types.SavePost): Promise<types.PostResponse>
  // TODO should unify these reports probably
  abstract createPostReport(
    form: types.CreatePostReport,
  ): Promise<types.PostReportResponse>
  abstract resolvePostReport(
    form: types.ResolvePostReport,
  ): Promise<types.PostReportResponse>
  abstract listPostReports(
    form: types.ListPostReports,
  ): Promise<types.ListPostReportsResponse>
  abstract getSiteMetadata(
    form: types.GetSiteMetadata,
  ): Promise<types.GetSiteMetadataResponse>
  abstract createComment(
    form: types.CreateComment,
  ): Promise<types.CommentResponse>
  abstract editComment(form: types.EditComment): Promise<types.CommentResponse>
  abstract deleteComment(
    form: types.DeleteComment,
  ): Promise<types.CommentResponse>
  abstract removeComment(
    form: types.RemoveComment,
  ): Promise<types.CommentResponse>
  abstract markCommentReplyAsRead(
    form: types.MarkCommentReplyAsRead,
  ): Promise<types.CommentReplyResponse | void>
  abstract likeComment(
    form: types.CreateCommentLike,
  ): Promise<types.CommentResponse>
  abstract listCommentLikes(
    form: types.ListCommentLikes,
  ): Promise<types.ListCommentLikesResponse>
  // TODO unify saving with posts too
  // i have options for unifying these since I'm making the API client myself now
  abstract saveComment(form: types.SaveComment): Promise<types.CommentResponse>
  abstract distinguishComment(
    form: types.DistinguishComment,
  ): Promise<types.CommentResponse>
  abstract getComments(
    form: types.GetComments,
  ): Promise<types.GetCommentsResponse>
  abstract getComment(form: types.GetComment): Promise<types.CommentResponse>
  abstract createCommentReport(
    form: types.CreateCommentReport,
  ): Promise<types.CommentReportResponse>
  abstract resolveCommentReport(
    form: types.ResolveCommentReport,
  ): Promise<types.CommentReportResponse>
  abstract listCommentReports(
    form: types.ListCommentReports,
  ): Promise<types.ListCommentReportsResponse>
  abstract getPrivateMessages(
    form: types.GetPrivateMessages,
  ): Promise<types.PrivateMessagesResponse>
  abstract createPrivateMessage(
    form: types.CreatePrivateMessage,
  ): Promise<types.PrivateMessageResponse>
  abstract editPrivateMessage(
    form: types.EditPrivateMessage,
  ): Promise<types.PrivateMessageResponse>
  abstract deletePrivateMessage(
    form: types.DeletePrivateMessage,
  ): Promise<types.PrivateMessageResponse>
  abstract markPrivateMessageAsRead(
    form: types.MarkPrivateMessageAsRead,
  ): Promise<types.PrivateMessageResponse>
  abstract createPrivateMessageReport(
    form: types.CreatePrivateMessageReport,
  ): Promise<types.PrivateMessageReportResponse>
  abstract resolvePrivateMessageReport(
    form: types.ResolvePrivateMessageReport,
  ): Promise<types.PrivateMessageReportResponse>
  abstract listPrivateMessageReports(
    form: types.ListPrivateMessageReports,
  ): Promise<types.ListPrivateMessageReportsResponse>
  abstract register(form: types.Register): Promise<types.LoginResponse>
  abstract login(form: types.Login): Promise<types.LoginResponse>
  abstract logout(): Promise<types.SuccessResponse>
  abstract getPersonDetails(
    form: types.GetPersonDetails,
  ): Promise<types.GetPersonDetailsResponse>
  // TODO unify these inbox things too
  abstract getPersonMentions(
    form: types.GetPersonMentions,
  ): Promise<types.GetPersonMentionsResponse>
  abstract markPersonMentionAsRead(
    form: types.MarkPersonMentionAsRead,
  ): Promise<types.PersonMentionResponse | void>
  abstract getReplies(form: types.GetReplies): Promise<types.GetRepliesResponse>
  abstract banPerson(form: types.BanPerson): Promise<types.BanPersonResponse>
  abstract getBannedPersons(): Promise<types.BannedPersonsResponse>
  abstract blockPerson(
    form: types.BlockPerson,
  ): Promise<types.BlockPersonResponse>
  abstract getCaptcha(): Promise<types.GetCaptchaResponse>
  abstract deleteAccount(
    form: types.DeleteAccount,
  ): Promise<types.SuccessResponse>
  abstract passwordReset(
    form: types.PasswordReset,
  ): Promise<types.SuccessResponse>
  abstract passwordChangeAfterReset(
    form: types.PasswordChangeAfterReset,
  ): Promise<types.SuccessResponse>
  abstract markAllAsRead(): Promise<types.GetRepliesResponse>
  abstract saveUserSettings(
    form: types.SaveUserSettings,
  ): Promise<types.SuccessResponse>
  abstract changePassword(
    form: types.ChangePassword,
  ): Promise<types.LoginResponse>
  abstract getReportCount(
    form: types.GetReportCount,
  ): Promise<types.GetReportCountResponse>
  abstract getUnreadCount(): Promise<types.GetUnreadCountResponse>
  abstract verifyEmail(form: types.VerifyEmail): Promise<types.SuccessResponse>
  abstract addAdmin(form: types.AddAdmin): Promise<types.AddAdminResponse>
  abstract getUnreadRegistrationApplicationCount(): Promise<types.GetUnreadRegistrationApplicationCountResponse>
  abstract listRegistrationApplications(
    form: types.ListRegistrationApplications,
  ): Promise<types.ListRegistrationApplicationsResponse>
  abstract approveRegistrationApplication(
    form: types.ApproveRegistrationApplication,
  ): Promise<types.RegistrationApplicationResponse>
  abstract getRegistrationApplication(
    form: types.GetRegistrationApplication,
  ): Promise<types.RegistrationApplicationResponse>
  abstract purgePerson(form: types.PurgePerson): Promise<types.SuccessResponse>
  abstract purgeCommunity(
    form: types.PurgeCommunity,
  ): Promise<types.SuccessResponse>
  abstract purgePost(form: types.PurgePost): Promise<types.SuccessResponse>
  abstract purgeComment(
    form: types.PurgeComment,
  ): Promise<types.SuccessResponse>
  abstract getFederatedInstances(): Promise<types.GetFederatedInstancesResponse>
  abstract blockInstance(
    form: types.BlockInstance,
  ): Promise<types.BlockInstanceResponse>
  abstract uploadImage(
    form: types.UploadImage,
  ): Promise<types.UploadImageResponse>
  abstract deleteImage(form: types.DeleteImage): Promise<boolean>
  abstract setFlair?(form: types.SetPersonFlair): Promise<types.PersonView>
  abstract getFeeds?(form: types.GetFeeds): Promise<types.GetFeedsResponse>
  abstract getTopics?(form: types.GetTopics): Promise<types.GetTopicsResponse>
  abstract assignFlair?(form: types.AssignFlair): Promise<types.PostView>
  abstract listMedia(form: types.ListMedia): Promise<types.ListMediaResponse>
  abstract voteOnPoll?(form: types.PollVote): Promise<types.PostView>
  abstract setNote?(form: types.SetNote): Promise<types.PersonView>
}

export type NullableFnArg<T, Fallback = never> = T extends (
  ...args: infer A
) => any
  ? A
  : Fallback

export type NullableFnReturn<T, Fallback = never> = T extends (
  ...args: any[]
) => infer A
  ? A
  : Fallback
