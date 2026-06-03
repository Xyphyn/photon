import * as v4 from 'lemmy-js-client'
import type { Community } from '.'

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

export interface PostView extends v4.PostView {
  post: Post
}

export interface Post extends v4.Post {
  poll?: PostPoll
  event?: PostEvent
}

export interface CreatePost extends v4.CreatePost {
  poll?: PostPoll
  event?: PostEvent
}

export interface EditPost extends v4.EditPost {
  poll?: PostPoll
  event?: PostEvent
}
