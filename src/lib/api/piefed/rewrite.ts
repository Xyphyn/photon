import * as base from '../types'
import type { components, paths } from './schema'

type Schema<T extends keyof components['schemas']> = components['schemas'][T]

type PathQuery<P extends keyof paths> = paths[P] extends {
  get: { parameters: { query?: infer Q } }
}
  ? Q
  : never

type PathBody<P extends keyof paths> = paths[P] extends {
  post: { requestBody: { content: { 'application/json': infer B } } }
}
  ? B
  : never

export function toPersonView(
  personView: Schema<'PersonView'>,
): base.PersonView {
  return {
    counts: personView.counts,
    is_admin: personView.is_admin,
    person: toPerson(personView.person),
  }
}

export function toPerson(person: Schema<'Person'>): base.Person {
  return {
    ...person,
    id: person.id,
    name: person.user_name,
    bot_account: person.bot,
  }
}

export function toLocalSite(site: Schema<'Site'>): base.LocalSite {
  if (site) return {}
  return {}
}

export function toCommunityView(
  communityView: Schema<'CommunityView'>,
): base.CommunityView {
  return {
    ...communityView,
    community: toCommunity(communityView.community),
    banned_from_community: false,
    counts: {
      comments: communityView.counts.post_reply_count,
      posts: communityView.counts.post_count,
      subscribers: communityView.counts.total_subscriptions_count,
      published: communityView.community.published,
      community_id: communityView.community.id,
      subscribers_local: communityView.counts.subscriptions_count,
      users_active_day: communityView.counts.active_daily ?? -1,
      users_active_half_year: communityView.counts.active_6monthly ?? -1,
      users_active_month: communityView.counts.active_monthly ?? -1,
      users_active_week: communityView.counts.active_weekly ?? -1,
    },
  }
}

export function toCommunity(community: Schema<'Community'>): base.Community {
  return {
    ...community,
    posting_restricted_to_mods: false,
    visibility: 'Public',
  }
}

export function toMyUser(myUser: Schema<'MyUserInfo'>): base.MyUserInfo {
  return {
    ...myUser,
    community_blocks: myUser.community_blocks.map((i) => ({
      community: toCommunity(i.community),
      person: toPerson(i.person),
    })),
    local_user_view: {
      ...myUser.local_user_view,
      // @ts-expect-error TODO make piefed sort types not explode
      local_user: {
        ...myUser.local_user_view.local_user,
        id: myUser.local_user_view.person.id,
        person_id: myUser.local_user_view.person.id,
        totp_2fa_enabled: false,
        default_listing_type: 'All',
      },
      person: toPerson(myUser.local_user_view.person),
    },
    follows: myUser.follows.map((i) => ({
      follower: toPerson(i.follower),
      community: toCommunity(i.community),
    })),
    moderates: myUser.moderates.map((i) => ({
      community: toCommunity(i.community),
      moderator: toPerson(i.moderator),
    })),
    instance_blocks: myUser.instance_blocks.map((i) => ({
      instance: i.instance,
      person: toPerson(i.person),
    })),
    person_blocks: myUser.person_blocks.map((i) => ({
      person: toPerson(i.person),
      target: toPerson(i.target),
    })),
    discussion_languages: myUser.discussion_languages.map((i) => i.id!),
  }
}

export function toPostView(postView: Schema<'PostView'>): base.PostView {
  return {
    ...postView,
    creator: toPerson(postView.creator),
    creator_blocked: false,
    post: toPost(postView.post),
    community: toCommunity(postView.community),
  }
}

export function toPost(post: Schema<'Post'>): base.Post {
  return {
    ...post,
    creator_id: -1,
    name: post.title,
    featured_community: post.sticky,
    featured_local: false,
  }
}

export function toCommentView(
  commentView: Schema<'CommentView'>,
): base.CommentView {
  return {
    ...commentView,
    comment: toComment(commentView.comment),
    creator: toPerson(commentView.creator),
    post: toPost(commentView.post),
    community: toCommunity(commentView.community),
    subscribed: commentView.subscribed as base.SubscribedType,
  }
}

export function toComment(comment: Schema<'Comment'>): base.Comment {
  return {
    ...comment,
    content: comment.body,
    creator_id: -1,
    distinguished: comment.distinguished ?? false,
  }
}

export function toCommentReplyView(
  commentReplyView: Schema<'CommentReplyView'>,
): base.CommentReplyView {
  return {
    ...commentReplyView,
    banned_from_community: false,
    creator_banned_from_community: false,
    comment: toComment(commentReplyView.comment),
    creator: toPerson(commentReplyView.creator),
    post: toPost(commentReplyView.post),
    community: toCommunity(commentReplyView.community),
    recipient: toPerson(commentReplyView.recipient),
  }
}

export function toPrivateMessageView(
  privateMessageView: Schema<'PrivateMessageView'>,
): base.PrivateMessageView {
  return {
    ...privateMessageView,
    creator: toPerson(privateMessageView.creator),
    recipient: toPerson(privateMessageView.recipient),
  }
}

export function toPersonMentionView(
  personMentionView: Schema<'CommentReplyView'>,
): base.PersonMentionView {
  return {
    ...personMentionView,
    person_mention: personMentionView.comment_reply,
    creator_banned_from_community: false,
    banned_from_community: false,
    comment: toComment(personMentionView.comment),
    community: toCommunity(personMentionView.community),
    post: toPost(personMentionView.post),
    creator: toPerson(personMentionView.creator),
    recipient: toPerson(personMentionView.recipient),
  }
}

export function toTopicView(topicView: Schema<'TopicView'>): base.TopicView {
  return {
    ...topicView,
    communities: topicView.communities?.map(toCommunity),
    children: topicView.children.map(toTopicView),
  }
}

export function toFeedView(feedView: Schema<'FeedView'>): base.FeedView {
  return {
    ...feedView,
    communities: feedView.communities?.map(toCommunity),
    children: feedView.children.map(toFeedView),
  }
}

export function fromGetPosts(
  getPosts: base.GetPosts,
): PathQuery<'/api/alpha/post/list'> {
  return {
    ...getPosts,
    sort: toSortType(getPosts.sort),
    page: Number(getPosts.page_cursor),
  }
}

export function fromGetComments(
  getComments: base.GetComments,
): PathQuery<'/api/alpha/comment/list'> {
  return {
    ...getComments,
    sort: toCommentSortType(getComments.sort),
  }
}

export function fromGetPost(
  getPost: base.GetPost,
): PathQuery<'/api/alpha/post'> {
  return getPost
}

export function fromGetReplies(
  getReplies: base.GetReplies,
): PathQuery<'/api/alpha/user/replies'> {
  return {
    ...getReplies,
    sort: toCommentSortType(getReplies.sort),
  }
}

export function fromSearch(
  search: base.Search,
): PathQuery<'/api/alpha/search'> {
  return {
    ...(search as Omit<base.Search, 'type_'> & {
      type_: 'Communities' | 'Users' | 'Url' | 'Posts'
    }),
    sort: toSortType(search.sort),
  }
}

export function fromCreatePost(
  createPost: base.CreatePost,
): PathBody<'/api/alpha/post'> {
  return {
    ...createPost,
    title: createPost.name,
  }
}

export function fromListCommunities(
  listCommunities: base.ListCommunities,
): PathQuery<'/api/alpha/community/list'> {
  return {
    ...listCommunities,
    type_: listCommunities.type_ as 'All',
    sort: toCommunitiesSortType(listCommunities.sort),
  }
}

export function fromCreateComment(
  createComment: base.CreateComment,
): PathBody<'/api/alpha/comment'> {
  return {
    ...createComment,
    body: createComment.content,
  }
}

export function toSortType(
  sortType?: base.SortType,
): Schema<'SortType'> | undefined {
  if (!sortType) return
  if (
    sortType == 'Old' ||
    sortType == 'MostComments' ||
    sortType == 'Controversial' ||
    sortType == 'NewComments'
  )
    sortType = 'New'
  if (sortType?.startsWith('Top')) sortType = 'TopAll'
  return sortType as Schema<'SortType'>
}

export function toCommentSortType(
  commentSortType?: base.CommentSortType,
): Schema<'CommentSortType'> | undefined {
  if (commentSortType == 'Controversial') commentSortType = undefined
  return commentSortType
}

export function toCommunitiesSortType(
  sortType?: base.SortType,
): 'Top' | 'Hot' | 'New' | undefined {
  if (sortType == 'Hot' || sortType == 'New' || sortType == undefined)
    return sortType
  else return 'Top'
}
