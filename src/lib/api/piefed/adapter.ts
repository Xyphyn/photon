import createClient from 'openapi-fetch'
import type { BaseClient, ClientType } from '../base'
import type * as types from '../types'
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
import type { components, paths } from './schema'

type piefed = components['schemas']

type ApiClient = ReturnType<typeof createClient<paths>>
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

// i think this should be inside baseclient maybe
type MethodName = NonNullable<
  {
    [K in keyof BaseClient]: BaseClient[K] extends (...args: any[]) => any
      ? K
      : never
  }[keyof BaseClient]
>

type MethodConfig<
  K extends MethodName,
  P extends keyof paths = keyof paths,
  M extends HttpMethod = 'GET',
> = {
  method: HttpMethod
  path: keyof paths
  query?: (params: Parameters<BaseClient[K]>[0]) => unknown
  body?: (params: Parameters<BaseClient[K]>[0]) => unknown
  transform: (
    response: SuccessResponse<P, M>,
    params: Parameters<BaseClient[K]>[0],
  ) => Awaited<ReturnType<BaseClient[K]>>
}

type MethodDef<K extends MethodName> =
  | MethodConfig<K>
  | ((client: ApiClient, params: any) => Promise<unknown>)
  | 'unsupported'

type MethodDefinitions = {
  [K in MethodName]: MethodDef<K>
}

type SuccessResponse<
  P extends keyof paths,
  M extends HttpMethod,
> = paths[P] extends {
  [K in M]: { responses: { 200: { content: { 'application/json': infer R } } } }
}
  ? R
  : paths[P] extends {
        [K in M]: {
          responses: { 201: { content: { 'application/json': infer R } } }
        }
      }
    ? R
    : never

function assertData<T>(response: { data?: T; error?: unknown }): T {
  if (response.error || !response.data) {
    throw new Error(
      `API error: ${JSON.stringify(response.error ?? 'No data returned')}`,
    )
  }
  return response.data
}

const transforms = {
  postView: (r: any) => ({ post_view: toPostView(r.post_view) }),

  commentView: (r: any) => ({
    comment_view: toCommentView(r.comment_view),
    recipient_ids: [],
  }),

  communityView: (r: any) => ({
    ...r,
    community_view: toCommunityView(r.community_view),
  }),

  privateMessageView: (r: any) => ({
    ...r,
    private_message_view: toPrivateMessageView(r.private_message_view),
  }),

  moderators: (r: any) => ({
    moderators: r.moderators.map((i: any) => ({
      community: toCommunity(i.community),
      moderator: toPerson(i.moderator),
    })),
  }),
}

const methods: MethodDefinitions = {
  getSite: {
    method: 'GET',
    path: '/api/alpha/site',
    transform: (r: piefed['GetSiteResponse']) => ({
      admins: r.admins.map(toPersonView),
      site_view: {
        counts: {
          comments: -1,
          communities: -1,
          posts: -1,
          site_id: -1,
          users: r.site.user_count ?? -1,
          users_active_day: -1,
          users_active_half_year: -1,
          users_active_month: -1,
          users_active_week: -1,
        },
        local_site: toLocalSite(r.site),
        site: r.site,
      },
      all_languages:
        (r.site.all_languages as {
          code: string
          id: number
          name: string
        }[]) ?? [],
      blocked_urls: [],
      custom_emojis: [],
      discussion_languages: [],
      taglines: [],
      version: r.version,
      my_user: r.my_user ? toMyUser(r.my_user) : undefined,
    }),
  },

  getSiteMetadata: {
    method: 'GET',
    path: '/api/alpha/post/site_metadata',
    query: (p) => p,
    transform: (r) => r,
  },

  getFederatedInstances: {
    method: 'GET',
    path: '/api/alpha/federated_instances',
    transform: (r) => r,
  },

  blockInstance: {
    method: 'POST',
    path: '/api/alpha/site/block',
    transform: (r) => r,
  },

  createPost: {
    method: 'POST',
    path: '/api/alpha/post',
    body: fromCreatePost,
    transform: transforms.postView,
  },

  getPost: {
    method: 'GET',
    path: '/api/alpha/post',
    query: fromGetPost,
    transform: (r: piefed['GetPostResponse']) => ({
      community_view: toCommunityView(r.community_view!),
      cross_posts: r.cross_posts!.map(toPostView),
      moderators: r.moderators!.map((i: any) => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
      post_view: toPostView(r.post_view),
    }),
  },

  editPost: {
    method: 'PUT',
    path: '/api/alpha/post',
    transform: transforms.postView,
  },

  deletePost: {
    method: 'POST',
    path: '/api/alpha/post/delete',
    transform: transforms.postView,
  },

  removePost: {
    method: 'POST',
    path: '/api/alpha/post/remove',
    transform: transforms.postView,
  },

  getPosts: {
    method: 'GET',
    path: '/api/alpha/post/list',
    query: fromGetPosts,
    transform: (r: piefed['ListPostsResponse'], p) => ({
      ...r,
      posts: r.posts.map(toPostView),
      next_page: String(Number(p.page_cursor ?? 1) + 1),
    }),
  },

  likePost: {
    method: 'POST',
    path: '/api/alpha/post/like',
    transform: transforms.postView,
  },

  markPostAsRead: {
    method: 'POST',
    path: '/api/alpha/post/mark_as_read',
    transform: () => ({ success: true }),
  },

  lockPost: {
    method: 'POST',
    path: '/api/alpha/post/lock',
    transform: transforms.postView,
  },

  featurePost: {
    method: 'POST',
    path: '/api/alpha/post/feature',
    transform: transforms.postView,
  },

  savePost: {
    method: 'PUT',
    path: '/api/alpha/post/save',
    transform: transforms.postView,
  },

  listPostLikes: {
    method: 'GET',
    path: '/api/alpha/post/like/list',
    query: (p) => p,
    transform: (r: piefed['ListPostLikesResponse']) => ({
      post_likes: r.post_likes!.map((i: any) => ({
        ...i,
        creator_banned_from_community: false,
        creator: toPerson(i.creator),
      })),
    }),
  },

  createPostReport: {
    method: 'POST',
    path: '/api/alpha/post/report',
    body: (p) => ({ ...p, report_remote: false }),
    transform: (r: piefed['PostReportResponse']) => ({
      post_report_view: {
        ...r.post_report_view,
        community: toCommunity(r.post_report_view.community),
        post: toPost(r.post_report_view.post),
        creator: toPerson(r.post_report_view.creator),
        resolver: (r.post_report_view as any).resolver
          ? toPerson((r.post_report_view as any).resolver)
          : undefined,
        post_creator: toPerson(r.post_report_view.post_creator),
        read: false,
        hidden: false,
        creator_banned_from_community: false,
        unread_comments: -1,
      },
    }),
  },

  voteOnPoll: {
    method: 'POST',
    path: '/api/alpha/post/poll_vote',
    transform: (r: piefed['PollVoteResponse']) => toPostView(r.post_view),
  },

  createComment: {
    method: 'POST',
    path: '/api/alpha/comment',
    body: fromCreateComment,
    transform: (r: piefed['GetCommentResponse']) => ({
      ...r,
      comment_view: toCommentView(r.comment_view),
      recipient_ids: [],
    }),
  },

  editComment: {
    method: 'PUT',
    path: '/api/alpha/comment',
    body: (p) => ({ ...p, body: p.content, distinguished: false }),
    transform: (r: piefed['GetCommentResponse']) => ({
      ...r,
      comment_view: toCommentView(r.comment_view),
      recipient_ids: [],
    }),
  },

  deleteComment: {
    method: 'POST',
    path: '/api/alpha/comment/delete',
    transform: (r: piefed['GetCommentResponse']) => ({
      ...r,
      comment_view: toCommentView(r.comment_view),
      recipient_ids: [],
    }),
  },

  removeComment: {
    method: 'POST',
    path: '/api/alpha/comment/remove',
    transform: (r: piefed['GetCommentResponse']) => ({
      ...r,
      comment_view: toCommentView(r.comment_view),
      recipient_ids: [],
    }),
  },

  markCommentReplyAsRead: {
    method: 'POST',
    path: '/api/alpha/comment/mark_as_read',
    transform: () => undefined,
  },

  likeComment: {
    method: 'POST',
    path: '/api/alpha/comment/like',
    body: (p) => ({ ...p, private: false }),
    transform: transforms.commentView,
  },

  listCommentLikes: {
    method: 'GET',
    path: '/api/alpha/comment/like/list',
    query: (p) => p,
    transform: (r: piefed['ListCommentLikesResponse']) => ({
      comment_likes: r.comment_likes!.map((i: any) => ({
        ...i,
        creator: toPerson(i.creator),
      })),
    }),
  },

  saveComment: {
    method: 'PUT',
    path: '/api/alpha/comment/save',
    transform: (r: piefed['GetCommentResponse']) => ({
      ...r,
      comment_view: toCommentView(r.comment_view),
      recipient_ids: [],
    }),
  },

  getComments: {
    method: 'GET',
    path: '/api/alpha/comment/list',
    query: fromGetComments,
    transform: (r: piefed['ListCommentsResponse']) => ({
      comments: r.comments.map(toCommentView),
    }),
  },

  getComment: {
    method: 'GET',
    path: '/api/alpha/comment',
    query: (p) => p,
    transform: (r: piefed['GetCommentResponse']) => ({
      ...r,
      comment_view: toCommentView(r.comment_view),
      recipient_ids: [],
    }),
  },

  // createCommentReport: async (client, params) => {
  //   const response = assertData(
  //     await client.POST('/api/alpha/comment/report', {
  //       body: {
  //         ...params,
  //         report_remote: false,
  //         reason: params.reason ?? '',
  //       } as any,
  //     }),
  //   )
  //   return {
  //     ...response,
  //     comment_report_view: {
  //       ...response.comment_report_view,
  //       comment: toComment(response.comment_report_view.comment),
  //       community: toCommunity(response.comment_report_view.community),
  //       comment_creator: toPerson(response.comment_report_view.comment_creator),
  //       creator: toPerson(response.comment_report_view.creator),
  //       post: toPost(response.comment_report_view.post),
  //       resolver: (response.comment_report_view as any).resolver
  //         ? toPerson((response.comment_report_view as any).resolver)
  //         : undefined,
  //       subscribed: response.comment_report_view.subscribed as SubscribedType,
  //     },
  //   }
  // },

  createCommentReport: {
    method: 'POST',
    path: '/api/alpha/comment/report',
    body: (p) => ({ ...p, report_report: false, reason: p.reason ?? '' }),
    transform: (r: piefed['GetCommentReportResponse']) => ({
      ...r,
      comment_report_view: {
        ...r.comment_report_view,
        comment: toComment(r.comment_report_view.comment),
        community: toCommunity(r.comment_report_view.community),
        comment_creator: toPerson(r.comment_report_view.comment_creator),
        creator: toPerson(r.comment_report_view.creator),
        post: toPost(r.comment_report_view.post),
        resolver: (r.comment_report_view as any).resolver
          ? toPerson((r.comment_report_view as any).resolver)
          : undefined,
        subscribed: r.comment_report_view.subscribed as types.SubscribedType,
      },
    }),
  },

  createCommunity: {
    method: 'POST',
    path: '/api/alpha/community',
    transform: (r: piefed['CommunityResponse']) => ({
      ...r,
      community_view: toCommunityView(r.community_view),
    }),
  },

  getCommunity: {
    method: 'GET',
    path: '/api/alpha/community',
    query: (p) => p,
    transform: (r: piefed['GetCommunityResponse']) => ({
      ...r,
      community_view: toCommunityView(r.community_view),
      moderators: r.moderators.map((i: any) => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
    }),
  },

  editCommunity: {
    method: 'PUT',
    path: '/api/alpha/community',
    transform: (r: piefed['CommunityResponse']) => ({
      ...r,
      community_view: toCommunityView(r.community_view),
    }),
  },

  listCommunities: {
    method: 'GET',
    path: '/api/alpha/community/list',
    query: fromListCommunities,
    transform: (r: piefed['ListCommunitiesResponse']) => ({
      communities: r.communities.map(toCommunityView),
    }),
  },

  followCommunity: {
    method: 'POST',
    path: '/api/alpha/community/follow',
    transform: (r: piefed['CommunityResponse']) => ({
      ...r,
      community_view: toCommunityView(r.community_view),
    }),
  },

  blockCommunity: {
    method: 'POST',
    path: '/api/alpha/community/block',
    transform: (r: piefed['CommunityResponse'], p) => ({
      ...r,
      community_view: toCommunityView(r.community_view),
      blocked: p.block,
    }),
  },

  deleteCommunity: {
    method: 'POST',
    path: '/api/alpha/community/delete',
    transform: (r: piefed['CommunityResponse']) => ({
      ...r,
      community_view: toCommunityView(r.community_view),
    }),
  },

  banFromCommunity: async (
    client,
    params: Parameters<BaseClient['banFromCommunity']>[0],
  ) => {
    const response = params.ban
      ? await client.POST('/api/alpha/community/moderate/ban', {
          body: {
            community_id: params.community_id,
            user_id: params.person_id,
            reason: params.reason ?? 'No reason provided.',
            // why is this nullable bro
            expiredAt: new Date(
              params.expires ?? '6767-06-07T06:07:06Z',
            ).toISOString(),
          } as any,
        })
      : await client.PUT('/api/alpha/community/moderate/unban', {
          body: {
            community_id: params.community_id,
            user_id: params.person_id,
          } as any,
        })

    return {
      banned: params.ban,
      person_view: {
        person: toPerson(assertData(response).banned_user!),
        counts: { comment_count: -1, person_id: -1, post_count: -1 },
        is_admin: false,
      },
    }
  },

  addModToCommunity: {
    method: 'POST',
    path: '/api/alpha/community/mod',
    transform: transforms.moderators,
  },

  search: {
    method: 'GET',
    path: '/api/alpha/search',
    query: fromSearch,
    transform: (r: piefed['SearchResponse']) => ({
      comments: [],
      communities: r.communities.map(toCommunityView),
      posts: r.posts.map(toPostView),
      users: r.users.map(toPersonView),
      type_: r.type_,
    }),
  },

  resolveObject: {
    method: 'GET',
    path: '/api/alpha/resolve_object',
    query: (p) => p,
    transform: (r: piefed['ResolveObjectResponse']) => ({
      // just make the rewrite options accept null values bro
      comment: r.comment ? toCommentView(r.comment) : undefined,
      community: r.community ? toCommunityView(r.community) : undefined,
      post: r.post ? toPostView(r.post) : undefined,
      person: r.person ? toPersonView(r.person) : undefined,
    }),
  },

  getPrivateMessages: {
    method: 'GET',
    path: '/api/alpha/private_message/list',
    query: (p) => p,
    transform: (r: piefed['ListPrivateMessagesResponse']) => ({
      private_messages: r.private_messages.map(toPrivateMessageView),
    }),
  },

  createPrivateMessage: {
    method: 'POST',
    path: '/api/alpha/private_message',
    transform: (p: piefed['PrivateMessageResponse']) => ({
      ...p,
      private_message_view: toPrivateMessageView(p.private_message_view),
    }),
  },

  editPrivateMessage: {
    method: 'PUT',
    path: '/api/alpha/private_message',
    transform: (p: piefed['PrivateMessageResponse']) => ({
      ...p,
      private_message_view: toPrivateMessageView(p.private_message_view),
    }),
  },

  deletePrivateMessage: {
    method: 'POST',
    path: '/api/alpha/private_message/delete',
    transform: (p: piefed['PrivateMessageResponse']) => ({
      ...p,
      private_message_view: toPrivateMessageView(p.private_message_view),
    }),
  },

  markPrivateMessageAsRead: {
    method: 'POST',
    path: '/api/alpha/private_message/mark_as_read',
    transform: (p: piefed['PrivateMessageResponse']) => ({
      ...p,
      private_message_view: toPrivateMessageView(p.private_message_view),
    }),
  },

  login: async (client, params) => {
    const response = await client.POST('/api/alpha/user/login', {
      body: { username: params.username_or_email, password: params.password },
    })
    return {
      verify_email_sent: false,
      registration_created: false,
      jwt: response.data?.jwt,
    }
  },

  getPersonDetails: {
    method: 'GET',
    path: '/api/alpha/user',
    query: (p) => ({ ...p, include_content: true, sort: toSortType(p.sort) }),
    transform: (r: piefed['GetUserResponse']) => ({
      comments: r.comments.map(toCommentView),
      moderates: r.moderates.map((i: any) => ({
        community: toCommunity(i.community),
        moderator: toPerson(i.moderator),
      })),
      person_view: toPersonView(r.person_view),
      posts: r.posts.map(toPostView),
    }),
  },

  getPersonMentions: {
    method: 'GET',
    path: '/api/alpha/user/mentions',
    query: (p) => ({ ...p, sort: toCommentSortType(p.sort) }),
    transform: (r: piefed['UserMentionsResponse']) => ({
      mentions: r.replies.map(toPersonMentionView),
    }),
  },

  // current xylight has no idea why past xylight did this
  markPersonMentionAsRead: async (client, params) => {
    await (client as any).POST('/api/alpha/mention/mark_as_read', {
      body: params,
    })
  },

  getReplies: {
    method: 'GET',
    path: '/api/alpha/user/replies',
    query: fromGetReplies,
    transform: (r: piefed['UserRepliesResponse']) => ({
      replies: r.replies.map(toCommentReplyView),
    }),
  },

  blockPerson: {
    method: 'POST',
    path: '/api/alpha/user/block',
    transform: (r: piefed['UserBlockResponse']) => ({
      ...r,
      person_view: toPersonView(r.person_view),
    }),
  },

  markAllAsRead: {
    method: 'POST',
    path: '/api/alpha/user/mark_all_as_read',
    transform: (r: piefed['UserMarkAllReadResponse']) => ({
      replies: r.replies.map(toCommentReplyView),
    }),
  },

  saveUserSettings: {
    method: 'PUT',
    path: '/api/alpha/user/save_user_settings',
    body: (p) => p,
    transform: () => ({ success: true }),
  },

  getUnreadCount: {
    method: 'GET',
    path: '/api/alpha/user/unread_count',
    transform: (r: piefed['UserUnreadCountsResponse']) => r,
  },

  setFlair: {
    method: 'POST',
    path: '/api/alpha/user/set_flair',
    transform: (r: piefed['UserSetFlairResponse']) => ({
      ...r,
      person_view: toPersonView(r.person_view!),
    }),
  },

  setNote: {
    method: 'POST',
    path: '/api/alpha/user/note',
    body: (p: types.SetNote) => ({ ...p, note: p.note ?? '' }),
    transform: (r: piefed['UserSetNoteResponse']) => ({
      ...r,
      person_view: toPersonView(r.person_view),
    }),
  },

  getFeeds: {
    method: 'GET',
    path: '/api/alpha/feed/list',
    query: (p: types.GetFeeds) => p,
    // why is it FeedList and not ListFeeds
    transform: (r: piefed['FeedListResponse']) => ({
      ...r,
      feeds: r.feeds.map(toFeedView),
    }),
  },

  getTopics: {
    method: 'GET',
    path: '/api/alpha/topic/list',
    query: (p: types.GetTopics) => p,
    // same here
    transform: (r: piefed['TopicListResponse']) => ({
      ...r,
      topics: r.topics.map(toTopicView),
    }),
  },

  uploadImage: async (client, params) => {
    const formData = new FormData()
    formData.append('file', params.image as File)
    const response = assertData(
      await client.POST('/api/alpha/upload/image', {
        body: formData as any,
      }),
    )
    return { ...response, msg: 'Image uploaded successfully' }
  },

  generateTotpSecret: 'unsupported',
  listLogins: 'unsupported',
  listAllMedia: 'unsupported',
  updateTotp: 'unsupported',
  getModlog: 'unsupported',
  hidePost: 'unsupported',
  hideCommunity: 'unsupported',
  removeCommunity: 'unsupported',
  resolvePostReport: 'unsupported',
  listPostReports: 'unsupported',
  distinguishComment: 'unsupported',
  resolveCommentReport: 'unsupported',
  listCommentReports: 'unsupported',
  createPrivateMessageReport: 'unsupported',
  resolvePrivateMessageReport: 'unsupported',
  listPrivateMessageReports: 'unsupported',
  register: 'unsupported',
  logout: 'unsupported',
  banPerson: 'unsupported',
  getBannedPersons: 'unsupported',
  getCaptcha: 'unsupported',
  deleteAccount: 'unsupported',
  passwordReset: 'unsupported',
  passwordChangeAfterReset: 'unsupported',
  changePassword: 'unsupported',
  getReportCount: 'unsupported',
  verifyEmail: 'unsupported',
  addAdmin: 'unsupported',
  getUnreadRegistrationApplicationCount: 'unsupported',
  listRegistrationApplications: 'unsupported',
  approveRegistrationApplication: 'unsupported',
  getRegistrationApplication: 'unsupported',
  purgePerson: 'unsupported',
  purgeCommunity: 'unsupported',
  purgePost: 'unsupported',
  purgeComment: 'unsupported',
  editSite: 'unsupported',
  deleteImage: 'unsupported',
  listMedia: 'unsupported',
} satisfies MethodDefinitions

export const PiefedClientConstants = {
  password: { minLength: 6, maxLength: 128 },
}

async function executeMethod<
  K extends MethodName,
  P extends keyof paths,
  M extends HttpMethod,
>(
  client: ApiClient,
  config: MethodConfig<K, P, M>,
  // i have been up for 3 hours writing typescript types. i am not going to be bothered to figure
  // this out right before i am at the end
  params: any,
): Promise<unknown> {
  const execute = async () => {
    if (config.method === 'GET') {
      return await client.GET(config.path as any, {
        params: { query: config.query?.(params) ?? params },
      })
    } else {
      return await (client as any)[config.method](config.path, {
        body: config.body?.(params) ?? params,
      })
    }
  }

  return execute().then((response) =>
    config.transform(assertData(response), params),
  )
}

export function createPiefedClient(
  baseUrl: string,
  args: {
    fetchFunction: (input: any, init: any) => Promise<any>
    headers: any
  },
): BaseClient {
  const client = createClient<paths>({
    baseUrl,
    fetch: args.fetchFunction as any,
    headers: args.headers,
  })

  const instance = {
    type: { name: 'piefed', baseUrl: '/api/alpha' } as ClientType,
  }

  return new Proxy(instance as BaseClient, {
    get(target, prop: string, receiver) {
      if (prop in target) return Reflect.get(target, prop, receiver)

      const def = methods[prop as MethodName]
      if (!def) return undefined

      if (def === 'unsupported') {
        return () => {
          throw new Error(`${prop} is not supported on PieFed`)
        }
      }

      if (typeof def === 'function') {
        return (params: unknown) => def(client, params)
      }

      return (params: unknown) => executeMethod(client, def, params)
    },
  })
}

export class PiefedClient {
  static constants = PiefedClientConstants

  #proxy: BaseClient

  constructor(
    baseUrl: string,
    args: {
      fetchFunction: (input: any, init: any) => Promise<any>
      headers: any
    },
  ) {
    this.#proxy = createPiefedClient(baseUrl, args)

    return new Proxy(this, {
      get: (target, prop) => {
        if (prop === 'constructor') return PiefedClient
        return (target.#proxy as any)[prop]
      },
    }) as any
  }
}
