import type { CommentSortType, SortType } from 'lemmy-js-client'
import { writable } from 'svelte/store'
import { env } from '$env/dynamic/public'

console.log('Using the following default settings from the environment:')
console.log(env)

export type View = 'card' | 'cozy' | 'list' | 'compact'

export const SSR_ENABLED = env.PUBLIC_SSR_ENABLED?.toLowerCase() == 'true'

// Returns a proper boolean or null.  Used to set boolean values from env var strings while allowing nullish coalescing to set default values.
const toBool = (str: string | undefined) => {
  if (!str) {
    return null
  }
  return str.toLowerCase() === 'true'
}

interface Preset {
  title?: string
  content: string
}

interface Settings {
  expandableImages: boolean
  // should have been named "fade" read posts
  markReadPosts: boolean
  showInstances: {
    user: boolean
    community: boolean
    comments: boolean
  }

  view: View

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
  expandCommunities: boolean
  displayNames: boolean
  nsfwBlur: boolean
  moderation: {
    presets: Preset[]
  }
  randomPlaceholders: boolean
  modlogCardView: boolean | undefined
  debugInfo: boolean
  expandImages: boolean

  font: 'inter' | 'satoshi/nunito' | 'system' | 'browser'
  leftAlign: boolean
  hidePhoton: boolean

  newWidth: boolean
  markPostsAsRead: boolean

  openLinksInNewTab: boolean
  crosspostOriginalLink: boolean

  embeds: {
    clickToView: boolean
    youtube: 'youtube' | 'invidious' | 'piped'
  }
  dock: {
    noGap: boolean
    top: boolean
  }
  posts: {
    deduplicateEmbed: boolean
  }
}

export const defaultSettings: Settings = {
  expandableImages: toBool(env.PUBLIC_EXPANDABLE_IMAGES) ?? true,
  markReadPosts: toBool(env.PUBLIC_MARK_READ_POSTS) ?? true,
  showInstances: {
    user: toBool(env.PUBLIC_SHOW_INSTANCES_USER) ?? true,
    community: toBool(env.PUBLIC_SHOW_INSTANCES_COMMUNITY) ?? true,
    comments: toBool(env.PUBLIC_SHOW_INSTANCES_COMMENTS) ?? true,
  },
  defaultSort: {
    sort: env.PUBLIC_DEFAULT_FEED_SORT ?? ('Active' as any),
    feed: env.PUBLIC_DEFAULT_FEED ?? ('Local' as any),
    comments: env.PUBLIC_DEFAULT_COMMENT_SORT ?? ('Hot' as any),
  },
  hidePosts: {
    deleted: toBool(env.PUBLIC_HIDE_DELETED) ?? true,
    removed: toBool(env.PUBLIC_HIDE_REMOVED) ?? true,
  },
  expandSidebar: toBool(env.PUBLIC_EXPAND_SIDEBAR) ?? true,
  expandCommunities: toBool(env.PUBLIC_EXPAND_COMMUNITIES) ?? true,
  displayNames: toBool(env.PUBLIC_DISPLAY_NAMES) ?? true,
  nsfwBlur: toBool(env.PUBLIC_NSFW_BLUR) ?? true,
  moderation: {
    presets: [
      {
        title: 'Preset 1',
        content: `Your submission in *"{{post}}"* was removed for {{reason}}.`,
      },
    ],
  },
  randomPlaceholders: toBool(env.PUBLIC_RANDOM_PLACEHOLDERS) ?? true,
  modlogCardView: toBool(env.PUBLIC_MODLOG_CARD_VIEW) ?? undefined,
  debugInfo: toBool(env.PUBLIC_DEBUG_INFO) ?? false,
  expandImages: toBool(env.PUBLIC_EXPAND_IMAGES) ?? true,
  // @ts-ignore
  view: env.PUBLIC_VIEW ?? 'cozy',
  // @ts-ignore
  font: env.PUBLIC_FONT ?? 'inter',
  leftAlign: toBool(env.PUBLIC_LEFT_ALIGN) ?? false,
  hidePhoton: toBool(env.PUBLIC_REMOVE_CREDIT) ?? false,
  newWidth: toBool(env.PUBLIC_LIMIT_LAYOUT_WIDTH) ?? true,
  markPostsAsRead: toBool(env.PUBLIC_MARK_POSTS_AS_READ) ?? true,
  openLinksInNewTab: false,
  crosspostOriginalLink: true,
  embeds: {
    clickToView: true,
    youtube: 'youtube',
  },
  dock: {
    noGap: false,
    top: false
  },
  posts: {
    deduplicateEmbed: true
  }
}

export const userSettings = writable(defaultSettings)

const migrate = (settings: any): Settings => {
  if (typeof settings.moderation.removalReasonPreset == 'string') {
    settings.moderation.presets = [
      {
        title: 'Preset 1',
        content: settings.moderation.removalReasonPreset,
      },
    ]
    settings.moderation.removalReasonPreset = undefined
  }

  return settings
}

if (typeof window != 'undefined') {
  let oldUserSettings = JSON.parse(
    localStorage.getItem('settings') ?? JSON.stringify(defaultSettings)
  )

  oldUserSettings = migrate(oldUserSettings)

  userSettings.set({ ...defaultSettings, ...oldUserSettings })
}

userSettings.subscribe((settings) => {
  if (typeof window != 'undefined') {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
})
