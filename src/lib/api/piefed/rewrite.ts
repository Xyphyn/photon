import { Search } from 'mono-svelte'
import type {
  Comment,
  CommentReplyView,
  CommentSortType,
  CommentView,
  Community,
  CommunityView,
  CreateComment,
  CreatePost,
  FeedView,
  GetComments,
  GetPost,
  GetPosts,
  GetReplies,
  ListCommunities,
  LocalSite,
  MyUserInfo,
  Person,
  PersonMentionView,
  PersonView,
  Post,
  PostView,
  PrivateMessageView,
  SortType,
  SubscribedType,
  TopicView,
} from '../types'
import type { components } from './schema'

export function toPersonView(
  personView: components['schemas']['PersonView'],
): PersonView {
  return {
    counts: personView.counts,
    is_admin: personView.is_admin,
    person: toPerson(personView.person),
  }
}

export function toPerson(person: components['schemas']['Person']): Person {
  return {
    ...person,
    id: person.id,
    name: person.user_name,
    bot_account: person.bot,
  }
}

export function toLocalSite(site: components['schemas']['Site']): LocalSite {
  if (site) return {}
  return {}
}

export function toCommunityView(
  communityView: components['schemas']['CommunityView'],
): CommunityView {
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

export function toCommunity(
  community: components['schemas']['Community'],
): Community {
  return {
    ...community,
    posting_restricted_to_mods: false,
    visibility: 'Public',
  }
}

export function toMyUser(
  myUser: components['schemas']['MyUserInfo'],
): MyUserInfo {
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

export function toPostView(
  postView: components['schemas']['PostView'],
): PostView {
  return {
    ...postView,
    creator: toPerson(postView.creator),
    creator_blocked: false,
    post: toPost(postView.post),
    community: toCommunity(postView.community),
  }
}

export function toPost(post: components['schemas']['Post']): Post {
  return {
    ...post,
    creator_id: -1,
    name: post.title,
    featured_community: post.sticky,
    featured_local: false,
  }
}

export function toCommentView(
  commentView: components['schemas']['CommentView'],
): CommentView {
  return {
    ...commentView,
    comment: toComment(commentView.comment),
    creator: toPerson(commentView.creator),
    post: toPost(commentView.post),
    community: toCommunity(commentView.community),
    subscribed: commentView.subscribed as SubscribedType,
  }
}

export function toComment(comment: components['schemas']['Comment']): Comment {
  return {
    ...comment,
    content: comment.body,
    creator_id: -1,
    distinguished: comment.distinguished ?? false,
  }
}

export function toCommentReplyView(
  commentReplyView: components['schemas']['CommentReplyView'],
): CommentReplyView {
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
  privateMessageView: components['schemas']['PrivateMessageView'],
): PrivateMessageView {
  return {
    ...privateMessageView,
    creator: toPerson(privateMessageView.creator),
    recipient: toPerson(privateMessageView.recipient),
  }
}

export function toPersonMentionView(
  personMentionView: components['schemas']['CommentReplyView'],
): PersonMentionView {
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

export function toTopicView(
  topicView: components['schemas']['TopicView'],
): TopicView {
  return {
    ...topicView,
    communities: topicView.communities?.map(toCommunity),
    children: topicView.children.map(toTopicView),
  }
}

export function toFeedView(
  feedView: components['schemas']['FeedView'],
): FeedView {
  return {
    ...feedView,
    communities: feedView.communities?.map(toCommunity),
    children: feedView.children.map(toFeedView),
  }
}

// Query calls
export function fromGetPosts(
  getPosts: GetPosts,
): components['parameters']['GetPosts'] {
  return {
    ...getPosts,
    sort: toSortType(getPosts.sort),
    page: Number(getPosts.page_cursor),
  }
}

export function fromGetComments(
  getComments: GetComments,
): components['schemas']['GetComments'] {
  return {
    ...getComments,
    sort: toCommentSortType(getComments.sort),
  }
}

export function fromGetPost(
  getPost: GetPost,
): components['schemas']['GetPost'] {
  return getPost
}

export function fromGetReplies(
  getReplies: GetReplies,
): components['schemas']['GetReplies'] {
  return {
    ...getReplies,
    sort: toCommentSortType(getReplies.sort),
  }
}

export function fromSearch(search: Search): components['schemas']['Search'] {
  return {
    ...(search as Omit<Search, 'type_'> & {
      type_: 'Communities' | 'Users' | 'Url' | 'Posts'
    }),
    sort: toSortType(search.sort),
  }
}

export function fromCreatePost(
  createPost: CreatePost,
): components['schemas']['CreatePost'] {
  return {
    ...createPost,
    title: createPost.name,
  }
}

export function fromListCommunities(
  listCommunities: ListCommunities,
): components['schemas']['CommunityRequest'] {
  return {
    ...listCommunities,
    sort: toCommunitiesSortType(listCommunities.sort),
  }
}

export function fromCreateComment(
  createComment: CreateComment,
): components['schemas']['CreateComment'] {
  return {
    ...createComment,
    body: createComment.content,
  }
}

// Misc
export function toSortType(
  sortType?: SortType,
): components['schemas']['SortType'] | undefined {
  if (
    sortType == 'Old' ||
    sortType == 'MostComments' ||
    sortType == 'Controversial' ||
    sortType == 'NewComments'
  )
    sortType = 'New'
  return sortType
}

export function toCommentSortType(
  commentSortType?: CommentSortType,
): components['schemas']['CommentSortType'] | undefined {
  if (commentSortType == 'Controversial') commentSortType = undefined
  return commentSortType
}

export function toCommunitiesSortType(
  sortType?: SortType,
): 'Top' | 'Hot' | 'New' | undefined {
  if (sortType == 'Hot' || sortType == 'New' || sortType == undefined)
    return sortType
  else return 'Top'
}
