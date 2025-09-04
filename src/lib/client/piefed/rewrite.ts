import type {
  Community,
  GetPosts,
  LocalSite,
  MyUserInfo,
  Person,
  PersonView,
  Post,
  PostView,
  SortType,
} from '../types'
import type { components, paths } from './schema'

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
    community_blocks: myUser.community_blocks.map(i => ({
      community: toCommunity(i.community),
      person: toPerson(i.person),
    })),
    local_user_view: {
      ...myUser.local_user_view,
      local_user: {
        ...myUser.local_user_view.local_user,
        id: myUser.local_user_view.person.id,
        person_id: myUser.local_user_view.person.id,
        totp_2fa_enabled: false,
        default_listing_type: 'All',
      },
      person: toPerson(myUser.local_user_view.person),
    },
    follows: myUser.follows.map(i => ({
      follower: toPerson(i.follower),
      community: toCommunity(i.community),
    })),
    moderates: myUser.moderates.map(i => ({
      community: toCommunity(i.community),
      moderator: toPerson(i.moderator),
    })),
    instance_blocks: myUser.instance_blocks.map(i => ({
      instance: i.instance,
      person: toPerson(i.person),
    })),
    person_blocks: myUser.person_blocks.map(i => ({
      person: toPerson(i.person),
      target: toPerson(i.target),
    })),
    discussion_languages: myUser.discussion_languages.map(i => i.id!),
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

// Query calls
export function fromGetPosts(
  getPosts: GetPosts,
): paths['/post/list']['get']['parameters'] {
  return {
    query: {
      GetPosts: {
        ...getPosts,
        sort: toSortType(getPosts.sort),
        page_cursor: Number(getPosts.page_cursor),
      },
    },
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
