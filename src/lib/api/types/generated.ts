export interface AddAdminResponse {
  admins: Array<PersonView>
}

export interface AddModToCommunityResponse {
  moderators: Array<CommunityModeratorView>
}

export interface BanFromCommunityResponse {
  person_view: PersonView
  banned: boolean
}

export interface BannedPersonsResponse {
  banned: Array<PersonView>
}

export interface BanPersonResponse {
  person_view: PersonView
  banned: boolean
}

export interface BlockCommunityResponse {
  community_view: CommunityView
  blocked: boolean
}
export interface BlockInstanceResponse {
  blocked: boolean
}

export interface BlockPersonResponse {
  person_view: PersonView
  blocked: boolean
}
export interface CaptchaResponse {
  png: string
  wav: string
  uuid: string
}

export interface CommentReplyResponse {
  comment_reply_view: CommentReplyView
}

export interface CommentReportResponse {
  comment_report_view: CommentReportView
}

export interface CommentResponse {
  comment_view: CommentView
  recipient_ids: Array<LocalUserId>
}

export interface CommunityResponse {
  community_view: CommunityView
  discussion_languages: Array<LanguageId>
}

export interface CustomEmojiResponse {
  custom_emoji: CustomEmojiView
}
export interface GenerateTotpSecretResponse {
  totp_secret_url: string
}

export interface GetCaptchaResponse {
  ok?: CaptchaResponse
}

export interface GetComment {
  id: CommentId
}

export interface GetComments {
  type_?: ListingType
  sort?: CommentSortType
  max_depth?: number
  page?: number
  limit?: number
  community_id?: CommunityId
  community_name?: string
  post_id?: PostId
  parent_id?: CommentId
  saved_only?: boolean
  liked_only?: boolean
  disliked_only?: boolean
}

export interface GetCommentsResponse {
  comments: Array<CommentView>
}

export interface GetCommunity {
  id?: CommunityId
  name?: string
}

export interface GetCommunityResponse {
  community_view: CommunityView
  site?: Site
  moderators: Array<CommunityModeratorView>
  discussion_languages: Array<LanguageId>
}

export interface GetFederatedInstancesResponse {
  federated_instances?: FederatedInstances
}

export interface GetModlog {
  mod_person_id?: PersonId
  community_id?: CommunityId
  page?: number
  limit?: number
  type_?: ModlogActionType
  other_person_id?: PersonId
  post_id?: PostId
  comment_id?: CommentId
}

export interface GetModlogResponse {
  removed_posts: Array<ModRemovePostView>
  locked_posts: Array<ModLockPostView>
  featured_posts: Array<ModFeaturePostView>
  removed_comments: Array<ModRemoveCommentView>
  removed_communities: Array<ModRemoveCommunityView>
  banned_from_community: Array<ModBanFromCommunityView>
  banned: Array<ModBanView>
  added_to_community: Array<ModAddCommunityView>
  transferred_to_community: Array<ModTransferCommunityView>
  added: Array<ModAddView>
  admin_purged_persons: Array<AdminPurgePersonView>
  admin_purged_communities: Array<AdminPurgeCommunityView>
  admin_purged_posts: Array<AdminPurgePostView>
  admin_purged_comments: Array<AdminPurgeCommentView>
  hidden_communities: Array<ModHideCommunityView>
}

export interface GetPersonDetails {
  person_id?: PersonId
  username?: string
  sort?: SortType
  page?: number
  limit?: number
  community_id?: CommunityId
  saved_only?: boolean
}

export interface GetPersonDetailsResponse {
  person_view: PersonView
  site?: Site
  comments: Array<CommentView>
  posts: Array<PostView>
  moderates: Array<CommunityModeratorView>
}

export interface GetPersonMentions {
  sort?: CommentSortType
  page?: number
  limit?: number
  unread_only?: boolean
}

export interface GetPersonMentionsResponse {
  mentions: Array<PersonMentionView>
}

export interface GetPost {
  id?: PostId
  comment_id?: CommentId
}

export interface GetPostResponse {
  post_view: PostView
  community_view: CommunityView
  moderators: Array<CommunityModeratorView>
  cross_posts: Array<PostView>
}

export interface GetPosts {
  type_?: ListingType
  sort?: SortType
  page?: number
  limit?: number
  community_id?: CommunityId
  community_name?: string
  saved_only?: boolean
  liked_only?: boolean
  disliked_only?: boolean
  show_hidden?: boolean
  show_read?: boolean
  show_nsfw?: boolean
  page_cursor?: PaginationCursor
  feed_id?: string
  topic_id?: string
}

export interface GetPostsResponse {
  posts: Array<PostView>
  next_page: PaginationCursor
}

export interface GetPrivateMessages {
  unread_only?: boolean
  page?: number
  limit?: number
  creator_id?: PersonId
}

export interface GetRegistrationApplication {
  person_id: PersonId
}

export interface GetReplies {
  sort?: CommentSortType
  page?: number
  limit?: number
  unread_only?: boolean
}

export interface GetRepliesResponse {
  replies: Array<CommentReplyView>
}

export interface GetReportCount {
  community_id?: CommunityId
}

export interface GetReportCountResponse {
  community_id?: CommunityId
  comment_reports: number
  post_reports: number
  private_message_reports?: number
}
export interface GetSiteMetadata {
  url: string
}

export interface GetSiteMetadataResponse {
  metadata: LinkMetadata
}

export interface GetSiteResponse {
  site_view: SiteView
  admins: Array<PersonView>
  version: string
  my_user?: MyUserInfo
  all_languages: Array<Language>
  discussion_languages: Array<LanguageId>
  taglines: Array<Tagline>
  custom_emojis: Array<CustomEmojiView>
  blocked_urls: Array<LocalSiteUrlBlocklist>
}
export interface GetUnreadCountResponse {
  replies: number
  mentions: number
  private_messages: number
}
export interface GetUnreadRegistrationApplicationCountResponse {
  registration_applications: number
}

export interface ListCommentLikesResponse {
  comment_likes: Array<VoteView>
}

export interface ListCommentReportsResponse {
  comment_reports: Array<CommentReportView>
}

export interface ListCommunitiesResponse {
  communities: Array<CommunityView>
}

export interface ListMediaResponse {
  images: Array<LocalImageView>
}

export interface ListPostLikesResponse {
  post_likes: Array<VoteView>
}

export interface ListPostReportsResponse {
  post_reports: Array<PostReportView>
}

export interface ListPrivateMessageReportsResponse {
  private_message_reports: Array<PrivateMessageReportView>
}

export interface ListRegistrationApplicationsResponse {
  registration_applications: Array<RegistrationApplicationView>
}
export interface LoginResponse {
  jwt?: string
  registration_created: boolean
  verify_email_sent: boolean
}

export interface PersonMentionResponse {
  person_mention_view: PersonMentionView
}

export interface PostReportResponse {
  post_report_view: PostReportView
}

export interface PostResponse {
  post_view: PostView
}

export interface PrivateMessageReportResponse {
  private_message_report_view: PrivateMessageReportView
}

export interface PrivateMessageResponse {
  private_message_view: PrivateMessageView
}

export interface PrivateMessagesResponse {
  private_messages: Array<PrivateMessageView>
}

export interface RegistrationApplicationResponse {
  registration_application: RegistrationApplicationView
}
export interface ResolveObjectResponse {
  comment?: CommentView
  post?: PostView
  community?: CommunityView
  person?: PersonView
}
// TODO fix
type ActivityId = any

export interface AddAdmin {
  person_id: PersonId
  added: boolean
}

export interface AddModToCommunity {
  community_id: CommunityId
  person_id: PersonId
  added: boolean
}

export interface AdminPurgeComment {
  id: number
  admin_person_id: PersonId
  post_id: PostId
  reason?: string
  when_: string
}

export interface AdminPurgeCommentView {
  admin_purge_comment: AdminPurgeComment
  admin?: Person
  post: Post
}

export interface AdminPurgeCommunity {
  id: number
  admin_person_id: PersonId
  reason?: string
  when_: string
}

export interface AdminPurgeCommunityView {
  admin_purge_community: AdminPurgeCommunity
  admin?: Person
}

export interface AdminPurgePerson {
  id: number
  admin_person_id: PersonId
  reason?: string
  when_: string
}

export interface AdminPurgePersonView {
  admin_purge_person: AdminPurgePerson
  admin?: Person
}

export interface AdminPurgePost {
  id: number
  admin_person_id: PersonId
  community_id: CommunityId
  reason?: string
  when_: string
}

export interface AdminPurgePostView {
  admin_purge_post: AdminPurgePost
  admin?: Person
  community: Community
}

export interface ApproveRegistrationApplication {
  id: RegistrationApplicationId
  approve: boolean
  deny_reason?: string
}

export interface BanFromCommunity {
  community_id: CommunityId
  person_id: PersonId
  ban: boolean
  remove_data?: boolean
  reason?: string
  expires?: number
}

export interface BanPerson {
  person_id: PersonId
  ban: boolean
  remove_data?: boolean
  reason?: string
  expires?: number
}

export interface BlockCommunity {
  community_id: CommunityId
  block: boolean
}

export interface BlockInstance {
  instance_id: InstanceId
  block: boolean
}

export interface BlockPerson {
  person_id: PersonId
  block: boolean
}
export interface ChangePassword {
  new_password: string
  new_password_verify: string
  old_password: string
}

export interface Comment {
  id: CommentId
  creator_id: PersonId
  post_id: PostId
  content: string
  removed: boolean
  published: string
  updated?: string
  deleted: boolean
  ap_id: string
  local: boolean
  path: string
  distinguished: boolean
  language_id: LanguageId
}

export interface CommentAggregates {
  comment_id: CommentId
  score: number
  upvotes: number
  downvotes: number
  published: string
  child_count: number
}
export type CommentId = number

export interface CommentReply {
  id: CommentReplyId
  recipient_id: PersonId
  comment_id: CommentId
  read: boolean
  published: string
}
export type CommentReplyId = number

export interface CommentReplyView {
  comment_reply: CommentReply
  comment: Comment
  creator: Person
  post: Post
  community: Community
  recipient: Person
  counts: CommentAggregates
  creator_banned_from_community: boolean
  banned_from_community: boolean
  creator_is_moderator: boolean
  creator_is_admin: boolean
  subscribed: SubscribedType
  saved: boolean
  creator_blocked: boolean
  my_vote?: number
}

export interface CommentReport {
  id: CommentReportId
  creator_id: PersonId
  comment_id: CommentId
  original_comment_text: string
  reason?: string
  resolved: boolean
  resolver_id?: PersonId
  published: string
  updated?: string
}
export type CommentReportId = number

export interface CommentReportView {
  comment_report: CommentReport
  comment: Comment
  post: Post
  community: Community
  creator: Person
  comment_creator: Person
  counts: CommentAggregates
  creator_banned_from_community: boolean
  creator_is_moderator: boolean
  creator_is_admin: boolean
  creator_blocked: boolean
  subscribed: SubscribedType
  saved: boolean
  my_vote?: number
  resolver?: Person
}
export type CommentSortType = 'Hot' | 'Top' | 'New' | 'Old' | 'Controversial'

export interface CommentView {
  comment: Comment
  creator: Person
  post: Post
  community: Community
  counts: CommentAggregates
  creator_banned_from_community: boolean
  banned_from_community: boolean
  creator_is_moderator: boolean
  creator_is_admin: boolean
  subscribed: SubscribedType
  saved: boolean
  creator_blocked: boolean
  my_vote?: number
}

export interface Community {
  id: CommunityId
  name: string
  title: string
  description?: string
  removed: boolean
  published: string
  updated?: string
  deleted: boolean
  nsfw: boolean
  actor_id: string
  local: boolean
  icon?: string
  banner?: string
  hidden: boolean
  posting_restricted_to_mods: boolean
  instance_id: InstanceId
  visibility: CommunityVisibility
}

export interface CommunityAggregates {
  community_id: CommunityId
  subscribers: number
  posts: number
  comments: number
  published: string
  users_active_day: number
  users_active_week: number
  users_active_month: number
  users_active_half_year: number
  subscribers_local: number
}

export interface CommunityBlockView {
  person: Person
  community: Community
}

export interface CommunityFollowerView {
  community: Community
  follower: Person
}
export type CommunityId = number

export interface CommunityModeratorView {
  community: Community
  moderator: Person
}

export interface CommunityView {
  community: Community
  subscribed: SubscribedType
  blocked: boolean
  counts: CommunityAggregates
  banned_from_community: boolean
  flair_list?: CommunityFlair[]
}
export type CommunityVisibility = 'Public' | 'LocalOnly'

export interface CreateComment {
  content: string
  post_id: PostId
  parent_id?: CommentId
  language_id?: LanguageId
}

export interface CreateCommentLike {
  comment_id: CommentId
  score: number
}

export interface CreateCommentReport {
  comment_id: CommentId
  reason?: string
}

export interface CreateCommunity {
  name: string
  title: string
  description?: string
  icon?: string
  banner?: string
  nsfw?: boolean
  posting_restricted_to_mods?: boolean
  discussion_languages?: Array<LanguageId>
  visibility?: CommunityVisibility
}
export interface CreateCustomEmoji {
  category: string
  shortcode: string
  image_url: string
  alt_text: string
  keywords: Array<string>
}

export interface CreatePost {
  name: string
  community_id: CommunityId
  url?: string
  body?: string
  alt_text?: string
  honeypot?: string
  nsfw?: boolean
  language_id?: LanguageId
  custom_thumbnail?: string
  poll?: PostPoll
  event?: PostEvent
}

export interface CreatePostLike {
  post_id: PostId
  score: number
}

export interface CreatePostReport {
  post_id: PostId
  reason: string
}

export interface CreatePrivateMessage {
  content: string
  recipient_id: PersonId
}

export interface CreatePrivateMessageReport {
  private_message_id: PrivateMessageId
  reason: string
}

export interface CreateSite {
  name: string
  sidebar?: string
  description?: string
  icon?: string
  banner?: string
  enable_downvotes?: boolean
  enable_nsfw?: boolean
  community_creation_admin_only?: boolean
  require_email_verification?: boolean
  application_question?: string
  private_instance?: boolean
  default_theme?: string
  default_post_listing_type?: ListingType
  default_sort_type?: SortType
  legal_information?: string
  application_email_admins?: boolean
  hide_modlog_mod_names?: boolean
  discussion_languages?: Array<LanguageId>
  slur_filter_regex?: string
  actor_name_max_length?: number
  rate_limit_message?: number
  rate_limit_message_per_second?: number
  rate_limit_post?: number
  rate_limit_post_per_second?: number
  rate_limit_register?: number
  rate_limit_register_per_second?: number
  rate_limit_image?: number
  rate_limit_image_per_second?: number
  rate_limit_comment?: number
  rate_limit_comment_per_second?: number
  rate_limit_search?: number
  rate_limit_search_per_second?: number
  federation_enabled?: boolean
  federation_debug?: boolean
  captcha_enabled?: boolean
  captcha_difficulty?: string
  allowed_instances?: Array<string>
  blocked_instances?: Array<string>
  taglines?: Array<string>
  registration_mode?: RegistrationMode
  content_warning?: string
  default_post_listing_mode?: PostListingMode
}

export interface CustomEmoji {
  id: CustomEmojiId
  local_site_id: LocalSiteId
  shortcode: string
  image_url: string
  alt_text: string
  category: string
  published: string
  updated?: string
}
export type CustomEmojiId = number

export interface CustomEmojiKeyword {
  custom_emoji_id: CustomEmojiId
  keyword: string
}

export interface CustomEmojiView {
  custom_emoji: CustomEmoji
  keywords: Array<CustomEmojiKeyword>
}
export interface DeleteAccount {
  password: string
  delete_content: boolean
}

export interface DeleteComment {
  comment_id: CommentId
  deleted: boolean
}

export interface DeleteCommunity {
  community_id: CommunityId
  deleted: boolean
}

export interface DeleteCustomEmoji {
  id: CustomEmojiId
}

export interface DeletePost {
  post_id: PostId
  deleted: boolean
}

export interface DeletePrivateMessage {
  private_message_id: PrivateMessageId
  deleted: boolean
}

export interface DistinguishComment {
  comment_id: CommentId
  distinguished: boolean
}

export interface EditComment {
  comment_id: CommentId
  content: string
  language_id?: LanguageId
}

export interface EditCommunity {
  community_id: CommunityId
  title?: string
  description?: string
  icon?: string
  banner?: string
  nsfw?: boolean
  posting_restricted_to_mods?: boolean
  discussion_languages?: Array<LanguageId>
  visibility?: CommunityVisibility
}

export interface EditCustomEmoji {
  id: CustomEmojiId
  category: string
  image_url: string
  alt_text: string
  keywords: Array<string>
}

export interface EditPost {
  post_id: PostId
  name?: string
  url?: string
  body?: string
  alt_text?: string
  nsfw?: boolean
  language_id?: LanguageId
  custom_thumbnail?: string
  poll?: PostPoll
  event?: PostEvent
}

export interface EditPrivateMessage {
  private_message_id: PrivateMessageId
  content: string
}

export interface EditSite {
  name?: string
  sidebar?: string
  description?: string
  icon?: string
  banner?: string
  enable_downvotes?: boolean
  enable_nsfw?: boolean
  community_creation_admin_only?: boolean
  require_email_verification?: boolean
  application_question?: string
  private_instance?: boolean
  default_theme?: string
  default_post_listing_type?: ListingType
  default_sort_type?: SortType
  legal_information?: string
  application_email_admins?: boolean
  hide_modlog_mod_names?: boolean
  discussion_languages?: Array<LanguageId>
  slur_filter_regex?: string
  actor_name_max_length?: number
  rate_limit_message?: number
  rate_limit_message_per_second?: number
  rate_limit_post?: number
  rate_limit_post_per_second?: number
  rate_limit_register?: number
  rate_limit_register_per_second?: number
  rate_limit_image?: number
  rate_limit_image_per_second?: number
  rate_limit_comment?: number
  rate_limit_comment_per_second?: number
  rate_limit_search?: number
  rate_limit_search_per_second?: number
  federation_enabled?: boolean
  federation_debug?: boolean
  captcha_enabled?: boolean
  captcha_difficulty?: string
  allowed_instances?: Array<string>
  blocked_instances?: Array<string>
  blocked_urls?: Array<string>
  taglines?: Array<string>
  registration_mode?: RegistrationMode
  reports_email_admins?: boolean
  content_warning?: string
  default_post_listing_mode?: PostListingMode
}

export interface FeaturePost {
  post_id: PostId
  featured: boolean
  feature_type: PostFeatureType
}

export interface FederatedInstances {
  linked: Array<InstanceWithFederationState>
  allowed: Array<InstanceWithFederationState>
  blocked: Array<InstanceWithFederationState>
}

export interface FollowCommunity {
  community_id: CommunityId
  follow: boolean
}

export interface HideCommunity {
  community_id: CommunityId
  hidden: boolean
  reason?: string
}

export interface HidePost {
  post_ids: Array<PostId>
  hide: boolean
}
export interface ImageDetails {
  link: string
  width: number
  height: number
  content_type: string
}

export interface Instance {
  id: InstanceId
  domain: string
  published: string
  updated?: string
  software?: string
  version?: string
}

export interface InstanceBlockView {
  person: Person
  instance: Instance
  site?: Site
}
export type InstanceId = number

export interface InstanceWithFederationState {
  id: InstanceId
  domain: string
  published: string
  updated?: string
  software?: string
  version?: string
  federation_state?: ReadableFederationState
}

export interface Language {
  id: LanguageId
  code: string
  name: string
}
export type LanguageId = number
export type LemmyErrorType =
  | {
      error: 'report_reason_required'
    }
  | {
      error: 'report_too_long'
    }
  | {
      error: 'not_a_moderator'
    }
  | {
      error: 'not_an_admin'
    }
  | {
      error: 'cant_block_yourself'
    }
  | {
      error: 'cant_block_admin'
    }
  | {
      error: 'couldnt_update_user'
    }
  | {
      error: 'passwords_do_not_match'
    }
  | {
      error: 'email_not_verified'
    }
  | {
      error: 'email_required'
    }
  | {
      error: 'couldnt_update_comment'
    }
  | {
      error: 'couldnt_update_private_message'
    }
  | {
      error: 'cannot_leave_admin'
    }
  | {
      error: 'no_lines_in_html'
    }
  | {
      error: 'site_metadata_page_is_not_doctype_html'
    }
  | {
      error: 'pictrs_response_error'
      message: string
    }
  | {
      error: 'pictrs_purge_response_error'
      message: string
    }
  | {
      error: 'pictrs_caching_disabled'
    }
  | {
      error: 'image_url_missing_path_segments'
    }
  | {
      error: 'image_url_missing_last_path_segment'
    }
  | {
      error: 'pictrs_api_key_not_provided'
    }
  | {
      error: 'no_content_type_header'
    }
  | {
      error: 'not_an_image_type'
    }
  | {
      error: 'not_a_mod_or_admin'
    }
  | {
      error: 'no_admins'
    }
  | {
      error: 'not_top_admin'
    }
  | {
      error: 'not_top_mod'
    }
  | {
      error: 'not_logged_in'
    }
  | {
      error: 'not_higher_mod'
    }
  | {
      error: 'not_higher_admin'
    }
  | {
      error: 'site_ban'
    }
  | {
      error: 'deleted'
    }
  | {
      error: 'banned_from_community'
    }
  | {
      error: 'couldnt_find_community'
    }
  | {
      error: 'couldnt_find_person'
    }
  | {
      error: 'couldnt_find_comment'
    }
  | {
      error: 'couldnt_find_comment_report'
    }
  | {
      error: 'couldnt_find_post_report'
    }
  | {
      error: 'couldnt_find_private_message_report'
    }
  | {
      error: 'couldnt_find_local_user'
    }
  | {
      error: 'couldnt_find_person_mention'
    }
  | {
      error: 'couldnt_find_registration_application'
    }
  | {
      error: 'couldnt_find_comment_reply'
    }
  | {
      error: 'couldnt_find_private_message'
    }
  | {
      error: 'couldnt_find_activity'
    }
  | {
      error: 'person_is_blocked'
    }
  | {
      error: 'community_is_blocked'
    }
  | {
      error: 'instance_is_blocked'
    }
  | {
      error: 'downvotes_are_disabled'
    }
  | {
      error: 'instance_is_private'
    }
  | {
      error: 'invalid_password'
    }
  | {
      error: 'site_description_length_overflow'
    }
  | {
      error: 'honeypot_failed'
    }
  | {
      error: 'registration_application_is_pending'
    }
  | {
      error: 'cant_enable_private_instance_and_federation_together'
    }
  | {
      error: 'locked'
    }
  | {
      error: 'couldnt_create_comment'
    }
  | {
      error: 'max_comment_depth_reached'
    }
  | {
      error: 'no_comment_edit_allowed'
    }
  | {
      error: 'only_admins_can_create_communities'
    }
  | {
      error: 'community_already_exists'
    }
  | {
      error: 'language_not_allowed'
    }
  | {
      error: 'only_mods_can_post_in_community'
    }
  | {
      error: 'couldnt_update_post'
    }
  | {
      error: 'no_post_edit_allowed'
    }
  | {
      error: 'couldnt_find_post'
    }
  | {
      error: 'edit_private_message_not_allowed'
    }
  | {
      error: 'site_already_exists'
    }
  | {
      error: 'application_question_required'
    }
  | {
      error: 'invalid_default_post_listing_type'
    }
  | {
      error: 'registration_closed'
    }
  | {
      error: 'registration_application_answer_required'
    }
  | {
      error: 'email_already_exists'
    }
  | {
      error: 'federation_forbidden_by_strict_allow_list'
    }
  | {
      error: 'person_is_banned_from_community'
    }
  | {
      error: 'object_is_not_public'
    }
  | {
      error: 'invalid_community'
    }
  | {
      error: 'cannot_create_post_or_comment_in_deleted_or_removed_community'
    }
  | {
      error: 'cannot_receive_page'
    }
  | {
      error: 'new_post_cannot_be_locked'
    }
  | {
      error: 'only_local_admin_can_remove_community'
    }
  | {
      error: 'only_local_admin_can_restore_community'
    }
  | {
      error: 'no_id_given'
    }
  | {
      error: 'incorrect_login'
    }
  | {
      error: 'invalid_query'
    }
  | {
      error: 'object_not_local'
    }
  | {
      error: 'post_is_locked'
    }
  | {
      error: 'person_is_banned_from_site'
      message: string
    }
  | {
      error: 'invalid_vote_value'
    }
  | {
      error: 'page_does_not_specify_creator'
    }
  | {
      error: 'no_email_setup'
    }
  | {
      error: 'local_site_not_setup'
    }
  | {
      error: 'email_smtp_server_needs_a_port'
    }
  | {
      error: 'missing_an_email'
    }
  | {
      error: 'rate_limit_error'
    }
  | {
      error: 'invalid_name'
    }
  | {
      error: 'invalid_display_name'
    }
  | {
      error: 'invalid_matrix_id'
    }
  | {
      error: 'invalid_post_title'
    }
  | {
      error: 'invalid_body_field'
    }
  | {
      error: 'bio_length_overflow'
    }
  | {
      error: 'alt_text_length_overflow'
    }
  | {
      error: 'missing_totp_token'
    }
  | {
      error: 'missing_totp_secret'
    }
  | {
      error: 'incorrect_totp_token'
    }
  | {
      error: 'couldnt_parse_totp_secret'
    }
  | {
      error: 'couldnt_generate_totp'
    }
  | {
      error: 'totp_already_enabled'
    }
  | {
      error: 'couldnt_like_comment'
    }
  | {
      error: 'couldnt_save_comment'
    }
  | {
      error: 'couldnt_create_report'
    }
  | {
      error: 'couldnt_resolve_report'
    }
  | {
      error: 'community_moderator_already_exists'
    }
  | {
      error: 'community_user_already_banned'
    }
  | {
      error: 'community_block_already_exists'
    }
  | {
      error: 'community_follower_already_exists'
    }
  | {
      error: 'couldnt_update_community_hidden_status'
    }
  | {
      error: 'person_block_already_exists'
    }
  | {
      error: 'user_already_exists'
    }
  | {
      error: 'token_not_found'
    }
  | {
      error: 'couldnt_like_post'
    }
  | {
      error: 'couldnt_save_post'
    }
  | {
      error: 'couldnt_mark_post_as_read'
    }
  | {
      error: 'couldnt_hide_post'
    }
  | {
      error: 'couldnt_update_community'
    }
  | {
      error: 'couldnt_update_replies'
    }
  | {
      error: 'couldnt_update_person_mentions'
    }
  | {
      error: 'post_title_too_long'
    }
  | {
      error: 'couldnt_create_post'
    }
  | {
      error: 'couldnt_create_private_message'
    }
  | {
      error: 'couldnt_update_private'
    }
  | {
      error: 'system_err_login'
    }
  | {
      error: 'couldnt_set_all_registrations_accepted'
    }
  | {
      error: 'couldnt_set_all_email_verified'
    }
  | {
      error: 'banned'
    }
  | {
      error: 'blocked_url'
    }
  | {
      error: 'couldnt_get_comments'
    }
  | {
      error: 'couldnt_get_posts'
    }
  | {
      error: 'invalid_url'
    }
  | {
      error: 'email_send_failed'
    }
  | {
      error: 'slurs'
    }
  | {
      error: 'couldnt_find_object'
    }
  | {
      error: 'registration_denied'
      message: string | null
    }
  | {
      error: 'federation_disabled'
    }
  | {
      error: 'domain_blocked'
      message: string
    }
  | {
      error: 'domain_not_in_allow_list'
      message: string
    }
  | {
      error: 'federation_disabled_by_strict_allow_list'
    }
  | {
      error: 'site_name_required'
    }
  | {
      error: 'site_name_length_overflow'
    }
  | {
      error: 'permissive_regex'
    }
  | {
      error: 'invalid_regex'
    }
  | {
      error: 'captcha_incorrect'
    }
  | {
      error: 'couldnt_create_audio_captcha'
    }
  | {
      error: 'invalid_url_scheme'
    }
  | {
      error: 'couldnt_send_webmention'
    }
  | {
      error: 'contradicting_filters'
    }
  | {
      error: 'instance_block_already_exists'
    }
  | {
      error: 'too_many_items'
    }
  | {
      error: 'community_has_no_followers'
    }
  | {
      error: 'ban_expiration_in_past'
    }
  | {
      error: 'invalid_unix_time'
    }
  | {
      error: 'invalid_bot_action'
    }
  | {
      error: 'cant_block_local_instance'
    }
  | {
      error: 'url_without_domain'
    }
  | {
      error: 'inbox_timeout'
    }
  | {
      error: 'unknown'
      message: string
    }
  | {
      error: 'cant_delete_site'
    }
  | {
      error: 'url_length_overflow'
    }
export interface LinkMetadata {
  title?: string
  description?: string
  image?: string
  embed_video_url?: string
  content_type?: string
}

export interface ListCommentLikes {
  comment_id: CommentId
  page?: number
  limit?: number
}

export interface ListCommentReports {
  comment_id?: CommentId
  page?: number
  limit?: number
  unresolved_only?: boolean
  community_id?: CommunityId
}

export interface ListCommunities {
  type_?: ListingType
  sort?: SortType
  show_nsfw?: boolean
  page?: number
  limit?: number
}
export type ListingType =
  | 'All'
  | 'Local'
  | 'Subscribed'
  | 'ModeratorView'
  | 'Popular'
export interface ListMedia {
  page?: number
  limit?: number
}

export interface ListPostLikes {
  post_id: PostId
  page?: number
  limit?: number
}

export interface ListPostReports {
  page?: number
  limit?: number
  unresolved_only?: boolean
  community_id?: CommunityId
  post_id?: PostId
}
export interface ListPrivateMessageReports {
  page?: number
  limit?: number
  unresolved_only?: boolean
}
export interface ListRegistrationApplications {
  unread_only?: boolean
  page?: number
  limit?: number
}

export interface LocalImage {
  local_user_id?: LocalUserId
  pictrs_alias: string
  pictrs_delete_token: string
  published: string
}

export interface LocalImageView {
  local_image: LocalImage
  person: Person
}

export interface LocalSite {
  id?: LocalSiteId
  site_id?: SiteId
  site_setup?: boolean
  enable_downvotes?: boolean
  enable_nsfw?: boolean
  community_creation_admin_only?: boolean
  require_email_verification?: boolean
  application_question?: string
  private_instance?: boolean
  default_theme?: string
  default_post_listing_type?: ListingType
  legal_information?: string
  hide_modlog_mod_names?: boolean
  application_email_admins?: boolean
  slur_filter_regex?: string
  actor_name_max_length?: number
  federation_enabled?: boolean
  captcha_enabled?: boolean
  captcha_difficulty?: string
  published?: string
  updated?: string
  registration_mode?: RegistrationMode
  reports_email_admins?: boolean
  federation_signed_fetch?: boolean
  default_post_listing_mode?: PostListingMode
  default_sort_type?: SortType
}
export type LocalSiteId = number

export interface LocalSiteRateLimit {
  local_site_id: LocalSiteId
  message: number
  message_per_second: number
  post: number
  post_per_second: number
  register: number
  register_per_second: number
  image: number
  image_per_second: number
  comment: number
  comment_per_second: number
  search: number
  search_per_second: number
  published: string
  updated?: string
}
export interface LocalSiteUrlBlocklist {
  id: number
  url: string
  published: string
  updated?: string
}

export interface LocalUser {
  id: LocalUserId
  person_id: PersonId
  email?: string
  show_nsfw: boolean
  default_sort_type: SortType
  default_listing_type: ListingType
  interface_language?: string
  show_avatars?: boolean
  show_scores?: boolean
  show_bot_accounts?: boolean
  show_read_posts?: boolean
  email_verified?: boolean
  accepted_application?: boolean
  totp_2fa_enabled: boolean
  last_donation_notification?: string
}
export type LocalUserId = number

export interface LocalUserView {
  local_user: LocalUser
  local_user_vote_display_mode?: LocalUserVoteDisplayMode
  person: Person
  counts: PersonAggregates
}

export interface LocalUserVoteDisplayMode {
  local_user_id: LocalUserId
  score: boolean
  upvotes: boolean
  downvotes: boolean
  upvote_percentage: boolean
}

export interface LockPost {
  post_id: PostId
  locked: boolean
}
export interface Login {
  username_or_email: string
  password: string
  totp_2fa_token?: string
}

export interface LoginToken {
  user_id: LocalUserId
  published: string
  ip?: string
  user_agent?: string
}

export interface MarkCommentReplyAsRead {
  comment_reply_id: CommentReplyId
  read: boolean
}

export interface MarkPersonMentionAsRead {
  person_mention_id: PersonMentionId
  read: boolean
}

export interface MarkPostAsRead {
  post_ids: Array<PostId>
  read: boolean
}

export interface MarkPrivateMessageAsRead {
  private_message_id: PrivateMessageId
  read: boolean
}

export interface ModAdd {
  id: number
  mod_person_id: PersonId
  other_person_id: PersonId
  removed: boolean
  when_: string
}

export interface ModAddCommunity {
  id: number
  mod_person_id: PersonId
  other_person_id: PersonId
  community_id: CommunityId
  removed: boolean
  when_: string
}

export interface ModAddCommunityView {
  mod_add_community: ModAddCommunity
  moderator?: Person
  community: Community
  modded_person: Person
}

export interface ModAddView {
  mod_add: ModAdd
  moderator?: Person
  modded_person: Person
}

export interface ModBan {
  id: number
  mod_person_id: PersonId
  other_person_id: PersonId
  reason?: string
  banned: boolean
  expires?: string
  when_: string
}

export interface ModBanFromCommunity {
  id: number
  mod_person_id: PersonId
  other_person_id: PersonId
  community_id: CommunityId
  reason?: string
  banned: boolean
  expires?: string
  when_: string
}

export interface ModBanFromCommunityView {
  mod_ban_from_community: ModBanFromCommunity
  moderator?: Person
  community: Community
  banned_person: Person
}

export interface ModBanView {
  mod_ban: ModBan
  moderator?: Person
  banned_person: Person
}

export interface ModFeaturePost {
  id: number
  mod_person_id: PersonId
  post_id: PostId
  featured: boolean
  when_: string
  is_featured_community: boolean
}

export interface ModFeaturePostView {
  mod_feature_post: ModFeaturePost
  moderator?: Person
  post: Post
  community: Community
}

export interface ModHideCommunity {
  id: number
  community_id: CommunityId
  mod_person_id: PersonId
  when_: string
  reason?: string
  hidden: boolean
}

export interface ModHideCommunityView {
  mod_hide_community: ModHideCommunity
  admin?: Person
  community: Community
}

export interface ModLockPost {
  id: number
  mod_person_id: PersonId
  post_id: PostId
  locked: boolean
  when_: string
}

export interface ModLockPostView {
  mod_lock_post: ModLockPost
  moderator?: Person
  post: Post
  community: Community
}
export type ModlogActionType =
  | 'All'
  | 'ModRemovePost'
  | 'ModLockPost'
  | 'ModFeaturePost'
  | 'ModRemoveComment'
  | 'ModRemoveCommunity'
  | 'ModBanFromCommunity'
  | 'ModAddCommunity'
  | 'ModTransferCommunity'
  | 'ModAdd'
  | 'ModBan'
  | 'ModHideCommunity'
  | 'AdminPurgePerson'
  | 'AdminPurgeCommunity'
  | 'AdminPurgePost'
  | 'AdminPurgeComment'

export interface ModlogListParams {
  community_id?: CommunityId
  mod_person_id?: PersonId
  other_person_id?: PersonId
  post_id?: PostId
  comment_id?: CommentId
  page?: number
  limit?: number
  hide_modlog_names: boolean
}

export interface ModRemoveComment {
  id: number
  mod_person_id: PersonId
  comment_id: CommentId
  reason?: string
  removed: boolean
  when_: string
}

export interface ModRemoveCommentView {
  mod_remove_comment: ModRemoveComment
  moderator?: Person
  comment: Comment
  commenter: Person
  post: Post
  community: Community
}

export interface ModRemoveCommunity {
  id: number
  mod_person_id: PersonId
  community_id: CommunityId
  reason?: string
  removed: boolean
  when_: string
}

export interface ModRemoveCommunityView {
  mod_remove_community: ModRemoveCommunity
  moderator?: Person
  community: Community
}

export interface ModRemovePost {
  id: number
  mod_person_id: PersonId
  post_id: PostId
  reason?: string
  removed: boolean
  when_: string
}

export interface ModRemovePostView {
  mod_remove_post: ModRemovePost
  moderator?: Person
  post: Post
  community: Community
}

export interface ModTransferCommunity {
  id: number
  mod_person_id: PersonId
  other_person_id: PersonId
  community_id: CommunityId
  when_: string
}

export interface ModTransferCommunityView {
  mod_transfer_community: ModTransferCommunity
  moderator?: Person
  community: Community
  modded_person: Person
}

export interface MyUserInfo {
  local_user_view: LocalUserView
  follows: Array<CommunityFollowerView>
  moderates: Array<CommunityModeratorView>
  community_blocks: Array<CommunityBlockView>
  instance_blocks: Array<InstanceBlockView>
  person_blocks: Array<PersonBlockView>
  discussion_languages: Array<LanguageId>
}
export interface OpenGraphData {
  title?: string
  description?: string
  image?: string
  embed_video_url?: string
}
export type PaginationCursor = string
export interface PasswordChangeAfterReset {
  token: string
  password: string
  password_verify: string
}
export interface PasswordReset {
  email: string
}

export interface Person {
  id: PersonId
  name: string
  display_name?: string
  avatar?: string
  banned: boolean
  published: string
  updated?: string
  actor_id: string
  bio?: string
  local: boolean
  banner?: string
  deleted: boolean
  matrix_user_id?: string
  bot_account: boolean
  ban_expires?: string
  instance_id: InstanceId
  flair?: string
  extra_fields?: {
    id: number
    label: string
    text: string
  }[]
  note?: string
}

export interface PersonAggregates {
  person_id: PersonId
  post_count: number
  comment_count: number
}

export interface PersonBlockView {
  person: Person
  target: Person
}
export type PersonId = number

export interface PersonMention {
  id: PersonMentionId
  recipient_id: PersonId
  comment_id: CommentId
  read: boolean
  published: string
}
export type PersonMentionId = number

export interface PersonMentionView {
  person_mention: PersonMention
  comment: Comment
  creator: Person
  post: Post
  community: Community
  recipient: Person
  counts: CommentAggregates
  creator_banned_from_community: boolean
  banned_from_community: boolean
  creator_is_moderator: boolean
  creator_is_admin: boolean
  subscribed: SubscribedType
  saved: boolean
  creator_blocked: boolean
  my_vote?: number
}

export interface PersonView {
  person: Person
  counts: PersonAggregates
  is_admin: boolean
}

export interface Post {
  id: PostId
  name: string
  url?: string
  body?: string
  creator_id: PersonId
  community_id: CommunityId
  removed: boolean
  locked: boolean
  published: string
  updated?: string
  deleted: boolean
  nsfw: boolean
  embed_title?: string
  embed_description?: string
  thumbnail_url?: string
  ap_id: string
  local: boolean
  embed_video_url?: string
  language_id: LanguageId
  featured_community: boolean
  featured_local: boolean
  url_content_type?: string
  alt_text?: string
  event?: PostEvent
  poll?: PostPoll
}

export interface PostAggregates {
  post_id: PostId
  comments: number
  score: number
  upvotes: number
  downvotes: number
  published: string
  newest_comment_time: string
}
export type PostFeatureType = 'Local' | 'Community'
export type PostId = number
export type PostListingMode = 'List' | 'Card' | 'SmallCard'

export interface PostReport {
  id: PostReportId
  creator_id: PersonId
  post_id: PostId
  original_post_name: string
  original_post_url?: string
  original_post_body?: string
  reason: string
  resolved: boolean
  resolver_id?: PersonId
  published: string
  updated?: string
}
export type PostReportId = number

export interface PostReportView {
  post_report: PostReport
  post: Post
  community: Community
  creator: Person
  post_creator: Person
  creator_banned_from_community: boolean
  creator_is_moderator: boolean
  creator_is_admin: boolean
  subscribed: SubscribedType
  saved: boolean
  read: boolean
  hidden: boolean
  creator_blocked: boolean
  my_vote?: number
  unread_comments: number
  counts: PostAggregates
  resolver?: Person
}

export interface PostView {
  post: Post
  creator: Person
  community: Community
  image_details?: ImageDetails
  creator_banned_from_community: boolean
  banned_from_community: boolean
  creator_is_moderator: boolean
  creator_is_admin: boolean
  counts: PostAggregates
  subscribed: SubscribedType
  saved: boolean
  read: boolean
  hidden: boolean
  creator_blocked: boolean
  my_vote?: number
  unread_comments: number
  flair_list?: CommunityFlair[]
}

export interface PrivateMessage {
  id: PrivateMessageId
  creator_id: PersonId
  recipient_id: PersonId
  content: string
  deleted: boolean
  read: boolean
  published: string
  updated?: string
  ap_id: string
  local: boolean
}
export type PrivateMessageId = number

export interface PrivateMessageReport {
  id: PrivateMessageReportId
  creator_id: PersonId
  private_message_id: PrivateMessageId
  original_pm_text: string
  reason: string
  resolved: boolean
  resolver_id?: PersonId
  published: string
  updated?: string
}
export type PrivateMessageReportId = number

export interface PrivateMessageReportView {
  private_message_report: PrivateMessageReport
  private_message: PrivateMessage
  private_message_creator: Person
  creator: Person
  resolver?: Person
}

export interface PrivateMessageView {
  private_message: PrivateMessage
  creator: Person
  recipient: Person
}

export interface PurgeComment {
  comment_id: CommentId
  reason?: string
}

export interface PurgeCommunity {
  community_id: CommunityId
  reason?: string
}

export interface PurgePerson {
  person_id: PersonId
  reason?: string
}

export interface PurgePost {
  post_id: PostId
  reason?: string
}

export interface ReadableFederationState {
  instance_id: InstanceId
  last_successful_id?: ActivityId
  last_successful_published_time?: string
  fail_count: number
  last_retry?: string
  next_retry?: string
}
export interface Register {
  username: string
  password: string
  password_verify: string
  show_nsfw?: boolean
  email?: string
  captcha_uuid?: string
  captcha_answer?: string
  honeypot?: string
  answer?: string
}

export interface RegistrationApplication {
  id: RegistrationApplicationId
  local_user_id: LocalUserId
  answer: string
  admin_id?: PersonId
  deny_reason?: string
  published: string
}
export type RegistrationApplicationId = number

export interface RegistrationApplicationView {
  registration_application: RegistrationApplication
  creator_local_user: LocalUser
  creator: Person
  admin?: Person
}
export type RegistrationMode = 'Closed' | 'RequireApplication' | 'Open'

export interface RemoveComment {
  comment_id: CommentId
  removed: boolean
  reason?: string
}

export interface RemoveCommunity {
  community_id: CommunityId
  removed: boolean
  reason?: string
}

export interface RemovePost {
  post_id: PostId
  removed: boolean
  reason?: string
}

export interface ResolveCommentReport {
  report_id: CommentReportId
  resolved: boolean
}
export interface ResolveObject {
  q: string
}

export interface ResolvePostReport {
  report_id: PostReportId
  resolved: boolean
}

export interface ResolvePrivateMessageReport {
  report_id: PrivateMessageReportId
  resolved: boolean
}

export interface SaveComment {
  comment_id: CommentId
  save: boolean
}

export interface SavePost {
  post_id: PostId
  save: boolean
}

export interface SaveUserSettings {
  show_nsfw?: boolean
  blur_nsfw?: boolean
  auto_expand?: boolean
  theme?: string
  default_sort_type?: SortType
  default_listing_type?: ListingType
  interface_language?: string
  avatar?: string
  banner?: string
  display_name?: string
  email?: string
  bio?: string
  matrix_user_id?: string
  show_avatars?: boolean
  send_notifications_to_email?: boolean
  bot_account?: boolean
  show_bot_accounts?: boolean
  show_read_posts?: boolean
  discussion_languages?: Array<LanguageId>
  open_links_in_new_tab?: boolean
  infinite_scroll_enabled?: boolean
  post_listing_mode?: PostListingMode
  enable_keyboard_navigation?: boolean
  enable_animated_images?: boolean
  collapse_bot_comments?: boolean
  show_scores?: boolean
  show_upvotes?: boolean
  show_downvotes?: boolean
  show_upvote_percentage?: boolean
}

export interface Search {
  q: string
  community_id?: CommunityId
  community_name?: string
  creator_id?: PersonId
  type_?: SearchType
  sort?: SortType
  listing_type?: ListingType
  page?: number
  limit?: number
  post_title_only?: boolean
}
export type SearchType =
  | 'All'
  | 'Comments'
  | 'Posts'
  | 'Communities'
  | 'Users'
  | 'Url'

export interface Site {
  id?: SiteId
  name: string
  sidebar?: string
  published?: string
  updated?: string
  icon?: string
  banner?: string
  description?: string
  actor_id: string
  last_refreshed_at?: string
  inbox_url?: string
  public_key?: string
  instance_id?: InstanceId
  content_warning?: string
}

export interface SiteAggregates {
  site_id: SiteId
  users: number
  posts: number
  comments: number
  communities: number
  users_active_day: number
  users_active_week: number
  users_active_month: number
  users_active_half_year: number
}
export type SiteId = number

export interface SiteView {
  site: Site
  local_site: LocalSite
  local_site_rate_limit?: LocalSiteRateLimit
  counts: SiteAggregates
}
export type SortType =
  | 'Active'
  | 'Hot'
  | 'New'
  | 'Old'
  | 'TopDay'
  | 'TopWeek'
  | 'TopMonth'
  | 'TopYear'
  | 'TopAll'
  | 'MostComments'
  | 'NewComments'
  | 'TopHour'
  | 'TopSixHour'
  | 'TopTwelveHour'
  | 'TopThreeMonths'
  | 'TopSixMonths'
  | 'TopNineMonths'
  | 'Controversial'
  | 'Scaled'
export type SubscribedType = 'Subscribed' | 'NotSubscribed' | 'Pending'

export interface Tagline {
  id: number
  local_site_id: LocalSiteId
  content: string
  published: string
  updated?: string
}

export interface TransferCommunity {
  community_id: CommunityId
  person_id: PersonId
}
export interface UpdateTotp {
  totp_token: string
  enabled: boolean
}
export interface VerifyEmail {
  token: string
}

export interface VoteView {
  creator: Person
  creator_banned_from_community: boolean
  score: number
}

export interface SearchResponse {
  type_: SearchType
  comments: Array<CommentView>
  posts: Array<PostView>
  communities: Array<CommunityView>
  users: Array<PersonView>
}

export interface SiteResponse {
  site_view: SiteView
  taglines: Array<Tagline>
}
export interface SuccessResponse {
  success: boolean
}
export interface UpdateTotpResponse {
  enabled: boolean
}

export interface UploadImage {
  image: File | Buffer
}
export interface UploadImageResponse {
  msg: string
  files?: ImageFile[]
  url?: string
  delete_url?: string
}
export interface ImageFile {
  file: string
  delete_token: string
}
export interface DeleteImage {
  token: string
  filename: string
}

export interface SetPersonFlair {
  community_id: number
  flair_text: string
}

export interface CommunityFlair {
  id: number
  community_id: number
  flair_title: string
  text_color: string
  background_color: string
  blur_images: boolean
  ap_id: string | null
}

export interface GetFeeds {
  include_communities?: boolean
  mine_only?: boolean
}

export interface FeedView {
  actor_id: string
  ap_domain: string
  children: FeedView[]
  communities?: Community[]
  communities_count: number
  id: number
  is_instance_feed: boolean
  local: boolean
  name: string
  nsfl: boolean
  nsfw: boolean
  owner: boolean
  public: boolean
  published: string
  show_posts_from_children: boolean
  subscribed: boolean
  subscriptions_count: number
  title: string
  updated: string
  user_id: number
  banner?: string
  description?: string
  description_html?: string
  icon?: string
  parent_feed_id?: number
}

export interface GetFeedsResponse {
  feeds: FeedView[]
}

export interface GetTopics {
  include_communities: boolean
}

export interface TopicView {
  children: TopicView[]
  communities?: Community[]
  communities_count: number
  id: number
  name: string
  show_posts_from_children: boolean
  title: string
  parent_topic_id?: number
}

export interface GetTopicsResponse {
  topics: TopicView[]
}

export interface AssignFlair {
  post_id: number
  flair_id_list: number[]
}

export interface PostPoll {
  end_poll?: string
  mode: string
  local_only: boolean
  latest_vote?: string
  choices: PollChoice[]
  my_votes?: number[]
}

export interface PollChoice {
  id: number
  choice_text: string
  sort_order: number
  num_votes: number
}

export interface PostEvent {
  start: string
  end?: string
  timezone?: string
  max_attendees: number
  participant_count: number
  full: boolean
  online_link?: string
  join_mode?: string
  external_participation_url?: string
  anonymous_participation: boolean
  online: boolean
  buy_tickets_link?: string
  event_fee_currency?: string
  event_fee_amount: number
  location?: {
    [key: string]: unknown
  }
}

export interface PollVote {
  post_id: number
  choice_id: number[]
}

export interface SetNote {
  person_id: number
  note: string | null
}
