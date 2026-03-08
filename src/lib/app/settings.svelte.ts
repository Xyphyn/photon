import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'
import type { CommentSortType, ListingType, SortType } from '$lib/api/types'
import type { Filter } from '$lib/feature/post/filters.svelte'
import { locale } from './i18n'

export type View = 'cozy' | 'compact'
export const SSR_ENABLED = env.PUBLIC_SSR_ENABLED?.toLowerCase() == 'true'

const toBool = (str: string | undefined) => {
  if (!str) return null
  return str.toLowerCase() === 'true'
}

interface Preset {
  title?: string
  content: string
}

type Leaf<T = any> = { default: T; env?: string }

type InferSettings<S> = {
  -readonly [K in keyof S]: S[K] extends Leaf<infer T> ? T : InferSettings<S[K]>
}

function isLeaf(node: unknown): node is Leaf {
  return node != null && typeof node === 'object' && 'default' in node
}

function resolveSchema(schema: Record<string, any>): any {
  const result: Record<string, any> = {}
  for (const [key, node] of Object.entries(schema)) {
    if (isLeaf(node)) {
      if (node.env) {
        // i hate typescript
        const envVal = (env as any)[node.env]
        if (typeof node.default === 'boolean') {
          result[key] = toBool(envVal) ?? node.default
        } else {
          result[key] = envVal ?? node.default
        }
      } else {
        result[key] = node.default
      }
    } else {
      result[key] = resolveSchema(node)
    }
  }
  return result
}

const settingsSchema = {
  settingsVer: { default: 8 },
  expandableImages: { default: true, env: 'PUBLIC_EXPANDABLE_IMAGES' },
  markReadPosts: { default: true, env: 'PUBLIC_MARK_READ_POSTS' },
  showInstances: {
    user: { default: true, env: 'PUBLIC_SHOW_INSTANCES_USER' },
    community: { default: true, env: 'PUBLIC_SHOW_INSTANCES_COMMUNITY' },
    comments: { default: true, env: 'PUBLIC_SHOW_INSTANCES_COMMENTS' },
  },
  defaultSort: {
    sort: { default: 'Active' as SortType, env: 'PUBLIC_DEFAULT_FEED_SORT' },
    feed: { default: 'Local' as ListingType, env: 'PUBLIC_DEFAULT_FEED' },
    comments: {
      default: 'Hot' as CommentSortType,
      env: 'PUBLIC_DEFAULT_COMMENT_SORT',
    },
  },
  hidePosts: {
    deleted: { default: false, env: 'PUBLIC_HIDE_DELETED' },
    removed: { default: false, env: 'PUBLIC_HIDE_REMOVED' },
  },
  expandSidebar: { default: true, env: 'PUBLIC_EXPAND_SIDEBAR' },
  expand: {
    communities: { default: true, env: 'PUBLIC_EXPAND_COMMUNITIES' },
    favorites: { default: true, env: 'PUBLIC_EXPAND_FAVORITES' },
    moderates: { default: true, env: 'PUBLIC_EXPAND_MODERATES' },
    about: { default: false },
    stats: { default: false },
    team: { default: false },
    accounts: { default: true },
  },
  displayNames: { default: true, env: 'PUBLIC_DISPLAY_NAMES' },
  nsfwBlur: { default: true, env: 'PUBLIC_NSFW_BLUR' },
  moderation: {
    presets: {
      default: [
        {
          title: 'Preset 1',
          content: `Your submission in *"{{post}}"* was removed for {{reason}}.`,
        },
      ] as Preset[],
    },
    defaultRemoveAction: { default: null as 'comment' | 'message' | null },
  },
  modlogCardView: {
    default: (toBool(env.PUBLIC_MODLOG_CARD_VIEW) ?? undefined) as
      | boolean
      | undefined,
  },
  debugInfo: { default: false, env: 'PUBLIC_DEBUG_INFO' },
  expandImages: { default: true, env: 'PUBLIC_EXPAND_IMAGES' },
  view: { default: 'compact' as View, env: 'PUBLIC_VIEW' },
  font: {
    default: 'inter' as 'inter' | 'system' | 'browser' | 'serifs',
    env: 'PUBLIC_FONT',
  },
  leftAlign: { default: false, env: 'PUBLIC_LEFT_ALIGN' },
  newWidth: { default: true, env: 'PUBLIC_LIMIT_LAYOUT_WIDTH' },
  markPostsAsRead: { default: true, env: 'PUBLIC_MARK_POSTS_AS_READ' },
  openLinksInNewTab: { default: false },
  crosspostOriginalLink: { default: true },
  embeds: {
    clickToView: { default: true },
    youtube: { default: 'youtube' as 'youtube' | 'invidious' | 'piped' },
    invidious: { default: undefined as string | undefined },
    piped: { default: undefined as string | undefined },
  },
  dock: {
    paletteHotkey: { default: '/' },
    autoHide: { default: true },
  },
  posts: {
    deduplicateEmbed: { default: true, env: 'PUBLIC_DEDUPLICATE_EMBED' },
    compactFeatured: { default: true, env: 'PUBLIC_COMPACT_FEATURED' },
    showHidden: { default: false },
    noVirtualize: { default: false },
    reverseActions: { default: false, env: 'PUBLIC_REVERSE_ACTIONS' },
    titleOpensUrl: { default: false, env: 'PUBLIC_TITLE_OPENS_URL' },
  },
  filters: { default: [] as Filter[] },
  forms: {
    autosubmitAutofill: { default: false },
  },
  infiniteScroll: { default: true },
  language: { default: null as string | null, env: 'PUBLIC_LANGUAGE' },
  useRtl: { default: false },
  parseTags: { default: true },
  logoColorMonth: { default: null as number | null },
  absoluteDates: { default: false },
  messages: {
    fullMarkdown: { default: false, env: 'PUBLIC_FULL_MARKDOWN' },
  },
  voteRatioBar: { default: false },
}

export type Settings = InferSettings<typeof settingsSchema>
export const defaultSettings: Settings = resolveSchema(settingsSchema)

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

export const settings = createSettingsState(structuredClone(defaultSettings))

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

export function mergeDeep(target: any, ...sources: any[]) {
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
