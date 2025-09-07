import type { CommentSortType, ListingType, SortType } from '$lib/client/types'
import { env } from '$env/dynamic/public'
import { locale } from './i18n/translations'
import { browser } from '$app/environment'

export type View = 'cozy' | 'compact'

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
  settingsVer: number
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
    feed: ListingType
    comments: CommentSortType
  }
  hidePosts: {
    deleted: boolean
    removed: boolean
  }
  expandSidebar: boolean
  expand: {
    communities: boolean
    moderates: boolean
    favorites: boolean
    about: boolean
    stats: boolean
    team: boolean
    accounts: boolean
  }
  displayNames: boolean
  nsfwBlur: boolean
  moderation: {
    presets: Preset[]
    defaultRemoveAction: 'comment' | 'message' | null
  }
  modlogCardView: boolean | undefined
  debugInfo: boolean
  expandImages: boolean

  font: 'inter' | 'system' | 'browser'
  leftAlign: boolean

  newWidth: boolean
  markPostsAsRead: boolean

  openLinksInNewTab: boolean
  crosspostOriginalLink: boolean

  embeds: {
    clickToView: boolean
    youtube: 'youtube' | 'invidious' | 'piped'
    invidious: string | undefined
    piped: string | undefined
  }
  dock: {
    paletteHotkey: string
    autoHide: boolean
  }
  posts: {
    deduplicateEmbed: boolean
    compactFeatured: boolean
    showHidden: boolean
    noVirtualize: boolean
    reverseActions: boolean
    titleOpensUrl: boolean
  }
  infiniteScroll: boolean
  language: string | null
  useRtl: boolean
  parseTags: boolean
  logoColorMonth: number | null

  absoluteDates: boolean
  messages: {
    fullMarkdown: boolean
  }
  voteRatioBar: boolean
}

export const defaultSettings: Settings = {
  settingsVer: 6,
  expandableImages: toBool(env.PUBLIC_EXPANDABLE_IMAGES) ?? true,
  markReadPosts: toBool(env.PUBLIC_MARK_READ_POSTS) ?? true,
  showInstances: {
    user: toBool(env.PUBLIC_SHOW_INSTANCES_USER) ?? true,
    community: toBool(env.PUBLIC_SHOW_INSTANCES_COMMUNITY) ?? true,
    comments: toBool(env.PUBLIC_SHOW_INSTANCES_COMMENTS) ?? true,
  },
  defaultSort: {
    sort: (env.PUBLIC_DEFAULT_FEED_SORT ?? 'Active') as SortType,
    feed: (env.PUBLIC_DEFAULT_FEED ?? 'Local') as ListingType,
    comments: (env.PUBLIC_DEFAULT_COMMENT_SORT ?? 'Hot') as CommentSortType,
  },
  hidePosts: {
    deleted: toBool(env.PUBLIC_HIDE_DELETED) ?? false,
    removed: toBool(env.PUBLIC_HIDE_REMOVED) ?? false,
  },
  expandSidebar: toBool(env.PUBLIC_EXPAND_SIDEBAR) ?? true,
  expand: {
    communities: toBool(env.PUBLIC_EXPAND_COMMUNITIES) ?? true,
    favorites: toBool(env.PUBLIC_EXPAND_FAVORITES) ?? true,
    moderates: toBool(env.PUBLIC_EXPAND_MODERATES) ?? true,
    about: false,
    stats: false,
    team: false,
    accounts: true,
  },
  displayNames: toBool(env.PUBLIC_DISPLAY_NAMES) ?? true,
  nsfwBlur: toBool(env.PUBLIC_NSFW_BLUR) ?? true,
  moderation: {
    presets: [
      {
        title: 'Preset 1',
        content: `Your submission in *"{{post}}"* was removed for {{reason}}.`,
      },
    ],
    defaultRemoveAction: null,
  },
  modlogCardView: toBool(env.PUBLIC_MODLOG_CARD_VIEW) ?? undefined,
  debugInfo: toBool(env.PUBLIC_DEBUG_INFO) ?? false,
  expandImages: toBool(env.PUBLIC_EXPAND_IMAGES) ?? true,
  view: (env.PUBLIC_VIEW as View) ?? 'compact',
  font: (env.PUBLIC_FONT as 'inter') ?? 'inter',
  leftAlign: toBool(env.PUBLIC_LEFT_ALIGN) ?? false,
  newWidth: toBool(env.PUBLIC_LIMIT_LAYOUT_WIDTH) ?? true,
  markPostsAsRead: toBool(env.PUBLIC_MARK_POSTS_AS_READ) ?? true,
  openLinksInNewTab: false,
  crosspostOriginalLink: true,
  embeds: {
    clickToView: true,
    youtube: 'youtube',
    invidious: undefined,
    piped: undefined,
  },
  dock: {
    paletteHotkey: '/',
    autoHide: true,
  },
  posts: {
    deduplicateEmbed: toBool(env.PUBLIC_DEDUPLICATE_EMBED) ?? true,
    compactFeatured: toBool(env.PUBLIC_COMPACT_FEATURED) ?? true,
    showHidden: false,
    noVirtualize: false,
    reverseActions: toBool(env.PUBLIC_REVERSE_ACTIONS) ?? false,
    titleOpensUrl: toBool(env.PUBLIC_TITLE_OPENS_URL) ?? false,
  },
  infiniteScroll: true,
  language: env.PUBLIC_LANGUAGE ?? null,
  useRtl: false,
  parseTags: true,
  logoColorMonth: null,
  absoluteDates: false,
  messages: {
    fullMarkdown: toBool(env.PUBLIC_FULL_MARKDOWN) ?? false,
  },
  voteRatioBar: false,
}

function createSettingsState(initial: Settings): Settings {
  let settings = $state(initial)
  if (browser) {
    try {
      const localSettings = JSON.parse(localStorage.getItem('settings') ?? '{}')
      const merged = mergeDeep(initial, localSettings)

      settings = merged
    } catch {
      /* empty */
    }
  }
  return settings
}

export const settings = createSettingsState(
  JSON.parse(JSON.stringify(defaultSettings)),
)

$effect.root(() => {
  $effect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))

    if (settings.language) {
      locale.set(settings.language)
    } else {
      if (browser) locale.set(navigator?.language)
    }
  })

  return () => {}
})

function isObject(item: object) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */

function mergeDeep(target: any, ...sources: any[]) {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return mergeDeep(target, ...sources)
}
