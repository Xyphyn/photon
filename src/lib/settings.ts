import type { CommentSortType, SortType } from 'lemmy-js-client'
import { writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

console.log('Using the following default settings from the environment:')
console.log(env)

export const SSR_ENABLED = env.PUBLIC_SSR_ENABLED?.toLowerCase() == 'true'

// Returns a proper boolean or null.  Used to set boolean values from env var strings while allowing nullish coalescing to set default values.
const toBool = (str: string | undefined) => {
  if (!str) {
    return null
  }
  return str.toLowerCase() === 'true'
}

interface Settings {
  expandableImages: boolean
  // should have been named "fade" read posts
  markReadPosts: boolean
  // ???
  instance?: string
  showInstances: {
    user: boolean
    community: boolean
    comments: boolean
  }
  // deprecated
  showCompactPosts: boolean

  view: 'card' | 'list' | 'compact'

  defaultSort: {
    sort: SortType
    feed: 'All' | 'Subscribed' | 'Local'
    comments: CommentSortType
  }
  hidePosts: {
    deleted: boolean
    removed: boolean
  }
  expandSidebar: boolean
  notifications: {
    enabled: boolean
    pollRate: number
    // how often to check in the background
    notifRate: number
  }
  displayNames: boolean
  nsfwBlur: boolean
  moderation: {
    removalReasonPreset: string
  }
  newVote: boolean
  randomPlaceholders: boolean
  modlogCardView: boolean | undefined
  debugInfo: boolean
  expandImages: boolean

  font: 'inter' | 'system' | 'browser'
  leftAlign: boolean
  hidePhoton: boolean
}

export const defaultSettings: Settings = {
  expandableImages: toBool(env.PUBLIC_EXPANDABLE_IMAGES) ?? true,
  markReadPosts: toBool(env.PUBLIC_MARK_READ_POSTS) ?? true,
  showInstances: {
    user: toBool(env.PUBLIC_SHOW_INSTANCES_USER) ?? false,
    community: toBool(env.PUBLIC_SHOW_INSTANCES_COMMUNITY) ?? true,
    comments: toBool(env.PUBLIC_SHOW_INSTANCES_COMMENTS) ?? false,
  },
  showCompactPosts: toBool(env.PUBLIC_SHOW_COMPACT_POSTS) ?? true,
  defaultSort: {
    sort: env.PUBLIC_DEFAULT_FEED_SORT ?? ('Active' as any),
    feed: env.PUBLIC_DEFAULT_FEED ?? ('Local' as any),
    comments: env.PUBLIC_DEFAULT_COMMENT_SORT ?? ('Hot' as any),
  },
  hidePosts: {
    deleted: toBool(env.PUBLIC_HIDE_DELETED) ?? true,
    removed: toBool(env.PUBLIC_HIDE_REMOVED) ?? false,
  },
  expandSidebar: toBool(env.PUBLIC_EXPAND_SIDEBAR) ?? true,
  notifications: {
    enabled: false,
    pollRate: 60 * 1000,
    notifRate: 10 * 60 * 1000,
  },
  displayNames: toBool(env.PUBLIC_DISPLAY_NAMES) ?? true,
  nsfwBlur: toBool(env.PUBLIC_NSFW_BLUR) ?? true,
  moderation: {
    removalReasonPreset: `Your submission in *"{{post}}"* was removed for {{reason}}.`,
  },
  newVote: toBool(env.PUBLIC_NEW_VOTE_BUTTONS) ?? false,
  randomPlaceholders: toBool(env.PUBLIC_RANDOM_PLACEHOLDERS) ?? true,
  modlogCardView: toBool(env.PUBLIC_MODLOG_CARD_VIEW) ?? undefined,
  debugInfo: false,
  expandImages: true,
  view: 'list',
  font: 'system',
  leftAlign: false,
  hidePhoton: toBool(env.PUBLIC_HIDE_POWERED_BY) ?? false,
}

export const userSettings = writable(defaultSettings)

if (typeof window != 'undefined') {
  let oldUserSettings = JSON.parse(
    localStorage.getItem('settings') ?? JSON.stringify(defaultSettings)
  )

  userSettings.set({ ...defaultSettings, ...oldUserSettings })
}

userSettings.subscribe((settings) => {
  if (typeof window != 'undefined') {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
})
