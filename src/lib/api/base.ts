import { env } from '$env/dynamic/public'
import * as types from './types'

export type ClientType =
  | { name: 'lemmy'; baseUrl: '/api/v3' }
  | { name: 'lemmy'; baseUrl: '/api/v4' }
  | { name: 'piefed'; baseUrl: '/api/alpha' }

export const DEFAULT_CLIENT_TYPE: ClientType =
  env.PUBLIC_INSTANCE_TYPE == 'piefedalpha'
    ? {
        name: 'piefed',
        baseUrl: '/api/alpha',
      }
    : env.PUBLIC_INSTANCE_TYPE == 'lemmyv3'
      ? {
          name: 'lemmy',
          baseUrl: '/api/v3',
        }
      : {
          name: 'lemmy',
          baseUrl: '/api/v4',
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
    base: string | URL,
  ): Promise<{ type: ClientType; version: string } | null> {
    try {
      const res = await fetch(new URL('/nodeinfo/2.1', base))

      if (!res.ok) return null

      const software: { name: string; version: string } = (await res.json()).software

      // should probably extract this into not a static function but its ok
      switch (software.name) {
        case 'lemmy': {
          // awful version parsing. works for now, TODO change later
          if (software.version.startsWith('1'))
            return {
              type: { baseUrl: '/api/v4', name: 'lemmy' },
              version: software.version,
            }
          else
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
  abstract listLogins(): Promise<types.ListLoginsResponse>
  abstract listMedia(form: types.ListMedia): Promise<types.PagedResponse<types.LocalImageView>>
  abstract editTotp(form: types.EditTotp): Promise<types.EditTotpResponse>
  abstract getModlog(form: types.GetModlog): Promise<types.PagedResponse<types.ModlogView>>
  abstract search(form: types.Search): Promise<types.SearchResponse>
  abstract resolveObject(form: types.ResolveObject): Promise<types.ResolveObjectView>
  abstract createCommunity(form: types.CreateCommunity): Promise<types.CommunityResponse>
  abstract getCommunity(form: types.GetCommunity): Promise<types.GetCommunityResponse>
  abstract editCommunity(form: types.EditCommunity): Promise<types.CommunityResponse>
  abstract listCommunities(
    form: types.ListCommunities,
  ): Promise<types.PagedResponse<types.CommunityView>>
  abstract followCommunity(form: types.FollowCommunity): Promise<types.CommunityResponse>
  abstract blockCommunity(form: types.BlockCommunity): Promise<types.CommunityResponse>
  abstract deleteCommunity(form: types.DeleteCommunity): Promise<types.CommunityResponse>
  abstract hideCommunity(form: types.HideCommunity): Promise<types.SuccessResponse>
  abstract removeCommunity(form: types.RemoveCommunity): Promise<types.CommunityResponse>
  abstract banFromCommunity(form: types.BanFromCommunity): Promise<types.PersonResponse>
  abstract addModToCommunity(
    form: types.AddModToCommunity,
  ): Promise<types.AddModToCommunityResponse>
  abstract createPost(form: types.CreatePost): Promise<types.PostResponse>
  abstract getPost(form: types.GetPost): Promise<types.GetPostResponse>
  abstract editPost(form: types.EditPost): Promise<types.PostResponse>
  abstract deletePost(form: types.DeletePost): Promise<types.PostResponse>
  abstract removePost(form: types.RemovePost): Promise<types.PostResponse>
  abstract markPostAsRead(form: types.MarkPostAsRead): Promise<types.PostResponse>
  abstract hidePost(form: types.HidePost): Promise<types.PostResponse>
  abstract lockPost(form: types.LockPost): Promise<types.PostResponse>
  abstract featurePost(form: types.FeaturePost): Promise<types.PostResponse>
  abstract getPosts(form: types.GetPosts): Promise<types.PagedResponse<types.PostView>>
  abstract likePost(form: types.CreatePostLike): Promise<types.PostResponse>
  abstract listPostLikes(form: types.ListPostLikes): Promise<types.PagedResponse<types.VoteView>>
  abstract savePost(form: types.SavePost): Promise<types.PostResponse>
  abstract getMyUser(): Promise<types.MyUserInfo>
  // TODO should unify these reports probably
  abstract createPostReport(form: types.CreatePostReport): Promise<types.PostReportResponse>
  abstract listReports(
    form: types.ListReports,
  ): Promise<types.PagedResponse<types.ReportCombinedView>>
  abstract getSiteMetadata(form: types.GetSiteMetadata): Promise<types.GetSiteMetadataResponse>
  abstract createComment(form: types.CreateComment): Promise<types.CommentResponse>
  abstract editComment(form: types.EditComment): Promise<types.CommentResponse>
  abstract deleteComment(form: types.DeleteComment): Promise<types.CommentResponse>
  abstract removeComment(form: types.RemoveComment): Promise<types.CommentResponse>
  abstract likeComment(form: types.CreateCommentLike): Promise<types.CommentResponse>
  abstract listCommentLikes(
    form: types.ListCommentLikes,
  ): Promise<types.PagedResponse<types.VoteView>>
  // TODO unify saving with posts too
  // i have options for unifying these since I'm making the API client myself now
  abstract saveComment(form: types.SaveComment): Promise<types.CommentResponse>
  abstract distinguishComment(form: types.DistinguishComment): Promise<types.CommentResponse>
  abstract getComments(form: types.GetComments): Promise<types.PagedResponse<types.CommentView>>
  abstract getCommentsSlim(
    form: types.GetComments,
  ): Promise<types.PagedResponse<types.CommentSlimView>>
  abstract getComment(form: types.GetComment): Promise<types.CommentResponse>
  abstract createCommentReport(
    form: types.CreateCommentReport,
  ): Promise<types.CommentReportResponse>
  abstract createPrivateMessage(
    form: types.CreatePrivateMessage,
  ): Promise<types.PrivateMessageResponse>
  abstract editPrivateMessage(form: types.EditPrivateMessage): Promise<types.PrivateMessageResponse>
  abstract deletePrivateMessage(
    form: types.DeletePrivateMessage,
  ): Promise<types.PrivateMessageResponse>
  abstract createPrivateMessageReport(
    form: types.CreatePrivateMessageReport,
  ): Promise<types.PrivateMessageReportResponse>
  abstract register(form: types.Register): Promise<types.LoginResponse>
  abstract login(form: types.Login): Promise<types.LoginResponse>
  abstract logout(): Promise<types.SuccessResponse>
  abstract getPersonDetails(form: types.GetPersonDetails): Promise<types.GetPersonDetailsResponse>
  abstract listPersonContent(
    form: types.ListPersonContent,
  ): Promise<types.PagedResponse<types.PostCommentCombinedView>>
  abstract listPersonSaved(
    form: types.ListPersonSaved,
  ): Promise<types.PagedResponse<types.PostCommentCombinedView>>
  abstract listPersonLiked(
    form: types.ListPersonLiked,
  ): Promise<types.PagedResponse<types.PostCommentCombinedView>>
  abstract listPersonRead(form: types.ListPersonRead): Promise<types.PagedResponse<types.PostView>>
  abstract listPersonHidden(
    form: types.ListPersonHidden,
  ): Promise<types.PagedResponse<types.PostView>>
  abstract listNotifications(
    form: types.ListNotifications,
  ): Promise<types.PagedResponse<types.NotificationView>>
  abstract banPerson(form: types.BanPerson): Promise<types.PersonResponse>
  abstract blockPerson(form: types.BlockPerson): Promise<types.PersonResponse>
  abstract getCaptcha(): Promise<types.GetCaptchaResponse>
  abstract deleteAccount(form: types.DeleteAccount): Promise<types.SuccessResponse>
  abstract resetPassword(form: types.ResetPassword): Promise<types.SuccessResponse>
  abstract changePasswordAfterReset(
    form: types.ChangePasswordAfterReset,
  ): Promise<types.SuccessResponse>
  abstract markAllNotificationsAsRead(): Promise<types.SuccessResponse>
  abstract saveUserSettings(form: types.SaveUserSettings): Promise<types.SuccessResponse>
  abstract changePassword(form: types.ChangePassword): Promise<types.LoginResponse>
  abstract getUnreadCounts(): Promise<types.UnreadCountsResponse>
  abstract verifyEmail(form: types.VerifyEmail): Promise<types.SuccessResponse>
  abstract addAdmin(form: types.AddAdmin): Promise<types.AddAdminResponse>
  abstract listRegistrationApplications(
    form: types.ListRegistrationApplications,
  ): Promise<types.PagedResponse<types.RegistrationApplicationView>>
  abstract approveRegistrationApplication(
    form: types.ApproveRegistrationApplication,
  ): Promise<types.RegistrationApplicationResponse>
  abstract getRegistrationApplication(
    form: types.GetRegistrationApplication,
  ): Promise<types.RegistrationApplicationResponse>
  abstract purgePerson(form: types.PurgePerson): Promise<types.SuccessResponse>
  abstract purgeCommunity(form: types.PurgeCommunity): Promise<types.SuccessResponse>
  abstract purgePost(form: types.PurgePost): Promise<types.SuccessResponse>
  abstract purgeComment(form: types.PurgeComment): Promise<types.SuccessResponse>
  abstract getFederatedInstances(
    form: types.GetFederatedInstances,
  ): Promise<types.PagedResponse<types.FederatedInstanceView>>
  abstract adminBlockInstance(form: types.AdminBlockInstanceParams): Promise<types.SuccessResponse>
  abstract adminAllowInstance(form: types.AdminAllowInstanceParams): Promise<types.SuccessResponse>
  abstract createTagline(form: types.CreateTagline): Promise<types.TaglineResponse>
  abstract editTagline(form: types.EditTagline): Promise<types.TaglineResponse>
  abstract deleteTagline(form: types.DeleteTagline): Promise<types.SuccessResponse>
  abstract listTaglines(form: types.ListTaglines): Promise<types.PagedResponse<types.Tagline>>
  abstract userBlockInstanceCommunities(
    form: types.UserBlockInstanceCommunitiesParams,
  ): Promise<types.SuccessResponse>
  abstract userBlockInstancePersons(
    form: types.UserBlockInstancePersonsParams,
  ): Promise<types.SuccessResponse>
  abstract adminListMedia(form: types.ListMedia): Promise<types.PagedResponse<types.LocalImageView>>
  abstract uploadImage(form: types.UploadImage): Promise<types.UploadImageResponse>
  abstract uploadSiteIcon(form: types.UploadImage): Promise<types.UploadImageResponse>
  abstract uploadSiteBanner(form: types.UploadImage): Promise<types.UploadImageResponse>
  abstract uploadUserAvatar(form: types.UploadImage): Promise<types.UploadImageResponse>
  abstract uploadUserBanner(form: types.UploadImage): Promise<types.UploadImageResponse>
  abstract uploadCommunityIcon(
    query: types.CommunityIdQuery,
    form: types.UploadImage,
  ): Promise<types.UploadImageResponse>
  abstract uploadCommunityBanner(
    query: types.CommunityIdQuery,
    form: types.UploadImage,
  ): Promise<types.UploadImageResponse>
  abstract deleteSiteIcon(): Promise<types.SuccessResponse>
  abstract deleteSiteBanner(): Promise<types.SuccessResponse>
  abstract deleteUserAvatar(): Promise<types.SuccessResponse>
  abstract deleteUserBanner(): Promise<types.SuccessResponse>
  abstract deleteCommunityIcon(query: types.CommunityIdQuery): Promise<types.SuccessResponse>
  abstract deleteCommunityBanner(query: types.CommunityIdQuery): Promise<types.SuccessResponse>
  abstract deleteMedia(query: types.DeleteImageParams): Promise<types.SuccessResponse>
  abstract adminDeleteMedia(query: types.DeleteImageParams): Promise<types.SuccessResponse>
  abstract markNotificationAsRead(
    form: types.MarkNotificationAsRead,
  ): Promise<types.SuccessResponse>

  abstract resolvePostReport(form: types.ResolvePostReport): Promise<types.PostReportResponse>
  abstract resolvePrivateMessageReport(
    form: types.ResolvePrivateMessageReport,
  ): Promise<types.PrivateMessageReportResponse>
  abstract resolveCommentReport(
    form: types.ResolveCommentReport,
  ): Promise<types.CommentReportResponse>
  abstract resolveCommunityReport(
    form: types.ResolveCommunityReport,
  ): Promise<types.CommunityReportResponse>
  abstract listMultiCommunities(
    form: types.ListMultiCommunities,
  ): Promise<types.PagedResponse<types.MultiCommunityView>>
  abstract followMultiCommunity(
    form: types.FollowMultiCommunity,
  ): Promise<types.MultiCommunityResponse>
  abstract setFlair?(form: types.SetPersonFlair): Promise<types.PersonView>
  abstract getFeeds?(form: types.GetFeeds): Promise<types.GetFeedsResponse>
  abstract getTopics?(form: types.GetTopics): Promise<types.GetTopicsResponse>
  abstract assignFlair?(form: types.AssignFlair): Promise<types.PostView>
  abstract voteOnPoll?(form: types.PollVote): Promise<types.PostView>
  abstract setNote?(form: types.SetNote): Promise<types.PersonView>
}

export type NullableFnArg<T, Fallback = never> = T extends (...args: infer A) => any ? A : Fallback

export type NullableFnReturn<T, Fallback = never> = T extends (...args: any[]) => infer A
  ? A
  : Fallback
