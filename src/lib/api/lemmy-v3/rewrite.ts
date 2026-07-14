import type * as types from 'lemmy-js-client'
import type * as v3 from 'lemmy-js-client-v3'

const defaultDate = '2026-07-11T20:53:54.537Z'

export const toSiteResponse = (from: v3.GetSiteResponse): types.GetSiteResponse => ({
  ...from,
  active_plugins: [],
  admin_oauth_providers: [],
  admins: from.admins.map(toPersonView),
  site_view: {
    ...from.site_view,
    instance: {
      domain: URL.parse(from.site_view.site.actor_id)?.hostname ?? '',
      id: -1,
      published_at: from.site_view.site.published,
    },
    site: {
      ...from.site_view.site,
      ap_id: from.site_view.site.actor_id,
      last_refreshed_at: defaultDate,
      published_at: from.site_view.site.published,
    },
    // @ts-expect-error Lemmy v3 admin config will be disabled for now
    local_site: {
      ...from.site_view.local_site,
      email_verification_required: from.site_view.local_site.require_email_verification,
      email_notifications_disabled: !from.site_view.local_site.reports_email_admins,
      post_downvotes: from.site_view.local_site.enable_downvotes ? 'all' : 'disable',
      comment_downvotes: from.site_view.local_site.enable_downvotes ? 'all' : 'disable',
    },
  },
})

export const toPersonView = (from: v3.PersonView): types.PersonView => ({
  ...from,
  banned: from.person.banned,
  person: toPerson(from.person, from.counts),
})

export const toPerson = (from: v3.Person, counts?: v3.PersonAggregates): types.Person => ({
  ...from,
  ap_id: from.actor_id,
  published_at: from.published,
  updated_at: from.updated,
  last_refreshed_at: defaultDate,
  comment_count: counts?.comment_count ?? 0,
  post_count: counts?.post_count ?? 0,
})

export const toPostView = (from: v3.PostView): types.PostView => ({
  ...from,
  // TODO this isn't used, but it'd be good to calculate it normally
  can_mod: false,
  creator: toPerson(from.creator),
  post: toPost(from.post, from.counts),
  tags: [],
  creator_banned: from.creator.banned,
  post_actions: {
    hidden_at: from.hidden ? defaultDate : undefined,
    saved_at: from.saved ? defaultDate : undefined,
    read_at: from.read ? defaultDate : undefined,
    voted_at: (from.my_vote ?? 0) != 0 ? defaultDate : undefined,
    vote_is_upvote: (from.my_vote ?? 0) != 0 ? from.my_vote == 1 : undefined,
  },
  community: toCommunity(from.community),
})

export const toPost = (from: v3.Post, counts?: v3.PostAggregates): types.Post => ({
  ...from,
  published_at: from.published,
  federation_pending: false,
  comments: counts?.comments ?? 0,
  upvotes: counts?.upvotes ?? 0,
  downvotes: counts?.downvotes ?? 0,
  score: counts?.score ?? 0,
  report_count: 0,
  unresolved_report_count: 0,
})

export const toCommunityView = (from: v3.CommunityView): types.CommunityView => ({
  ...from,
  can_mod: false,
  community: toCommunity(from.community),
  tags: [],
  community_actions: {
    follow_state: from.subscribed == 'Subscribed' ? 'accepted' : undefined,
    blocked_at: from.blocked ? defaultDate : undefined,
  },
})

export const toCommunity = (
  from: v3.Community,
  counts?: v3.CommunityAggregates,
): types.Community => ({
  ...from,
  ap_id: from.actor_id,
  comments: counts?.comments ?? 0,
  last_refreshed_at: defaultDate,
  published_at: from.published,
  posts: counts?.posts ?? 0,
  subscribers: counts?.subscribers ?? 0,
  subscribers_local: counts?.subscribers_local ?? 0,
  users_active_day: counts?.users_active_day ?? 0,
  users_active_half_year: counts?.users_active_half_year ?? 0,
  users_active_month: counts?.users_active_month ?? 0,
  users_active_week: counts?.users_active_week ?? 0,
  report_count: 0,
  unresolved_report_count: 0,
  local_removed: false,
  visibility: toVisibility[from.visibility],
})

export const fromGetPosts = (from: types.GetPosts): v3.GetPosts => ({
  ...from,
  type_: from.type_ ? fromListingType[from.type_] : undefined,
  // refer to fromPostSortType
  sort: from.sort ? fromPostSortType[from.sort] : undefined,
  page_cursor: from.page_cursor,
})

export const toGetPostsResponse = (
  from: v3.GetPostsResponse,
): types.PagedResponse<types.PostView> => ({
  items: from.posts.map(toPostView),
  next_page: from.next_page,
})

export const toMyUserInfo = (
  from: NonNullable<v3.GetSiteResponse['my_user']>,
): types.MyUserInfo => ({
  ...from,
  community_blocks: from.community_blocks.map((i) => toCommunity(i.community)),
  multi_community_follows: [],
  instance_communities_blocks: from.instance_blocks.map((i) => ({
    ...i.instance,
    published_at: i.instance.published,
  })),
  instance_persons_blocks: [],
  keyword_blocks: [],
  follows: from.follows.map((i) => ({
    community: toCommunity(i.community),
    follower: toPerson(i.follower),
  })),
  moderates: from.moderates.map((i) => ({
    community: toCommunity(i.community),
    moderator: toPerson(i.moderator),
  })),
  person_blocks: from.person_blocks.map((i) => toPerson(i.person)),
  local_user_view: {
    ...from.local_user_view,
    banned: from.local_user_view.person.banned,
    // @ts-expect-error As with local_site, profile editing will be temporarily disabled in lemmy v3
    local_user: {
      show_score: from.local_user_view.local_user_vote_display_mode.score,
    },
    person: toPerson(from.local_user_view.person),
  },
})

export const toCommentView = (from: v3.CommentView): types.CommentView => ({
  ...from,
  can_mod: false,
  creator_banned: from.creator.banned,
  comment: toComment(from.comment, from.counts),
  community: toCommunity(from.community),
  creator: toPerson(from.creator),
  post: toPost(from.post),
  comment_actions: {
    saved_at: from.saved ? defaultDate : undefined,
    vote_is_upvote: from.my_vote != undefined ? from.my_vote == 1 : undefined,
    voted_at: from.my_vote != undefined ? defaultDate : undefined,
  },
  tags: [],
})

export const toComment = (from: v3.Comment, counts?: v3.CommentAggregates): types.Comment => ({
  ...from,
  child_count: counts?.child_count ?? 0,
  downvotes: counts?.downvotes ?? 0,
  upvotes: counts?.upvotes ?? 0,
  score: counts?.score ?? 0,
  published_at: from.published,
  updated_at: from.updated,
  report_count: 0,
  unresolved_report_count: 0,
  federation_pending: false,
  locked: false,
})

export const fromGetComments = (from: types.GetComments): v3.GetComments => ({
  ...from,
  // TODO as with post sort type, need to account for time_range_seconds
  sort: from.sort ? fromCommentSortType[from.sort] : undefined,
  type_: from.type_ ? fromListingType[from.type_] : undefined,
})

export const toVisibility: Record<v3.CommunityVisibility, types.CommunityVisibility> = {
  LocalOnly: 'local_only_public',
  Public: 'public',
}

export const toListingType: Record<v3.ListingType, types.ListingType> = {
  All: 'all',
  Local: 'local',
  ModeratorView: 'moderator_view',
  Subscribed: 'subscribed',
}

export const fromListingType: Record<types.ListingType, v3.ListingType> = {
  all: 'All',
  local: 'Local',
  moderator_view: 'ModeratorView',
  subscribed: 'Subscribed',
  suggested: 'All',
}

// TODO need to make this a function, that takes in `period` so that we can map `top` accurately
export const fromPostSortType: Record<types.PostSortType, v3.SortType> = {
  active: 'Active',
  controversial: 'Controversial',
  hot: 'Hot',
  most_comments: 'MostComments',
  new: 'New',
  new_comments: 'NewComments',
  old: 'Old',
  scaled: 'Scaled',
  top: 'TopAll',
}

export const fromCommentSortType: Record<types.CommentSortType, v3.CommentSortType> = {
  controversial: 'Controversial',
  hot: 'Hot',
  new: 'New',
  old: 'Old',
  top: 'Top',
}
