import type { CommentSortType, SortType } from 'lemmy-js-client'
import { writable } from 'svelte/store'

interface Settings {
  newComments: boolean
  expandableImages: boolean
  markReadPosts: boolean
  instance?: string
  revertColors: boolean
  showInstances: {
    user: boolean
    community: boolean
    comments: boolean
  }
  showCompactPosts: boolean
  defaultSort: {
    sort: SortType
    feed: 'All' | 'Subscribed' | 'Local'
    comments: CommentSortType
  }
  hidePosts: {
    deleted: boolean
    removed: boolean
  }
  fullWidthLayout: boolean
  expandSidebar: boolean
  notifications: {
    enabled: boolean
    pollRate: number
    // how often to check in the background
    notifRate: number
  }
  displayNames: boolean
  nsfwBlur: boolean
}

export const defaultSettings: Settings = {
  newComments: true,
  expandableImages: true,
  markReadPosts: true,
  revertColors: false,
  showInstances: {
    user: false,
    community: true,
    comments: false,
  },
  showCompactPosts: false,
  defaultSort: {
    sort: 'Active',
    feed: 'Local',
    comments: 'Hot',
  },
  hidePosts: {
    deleted: true,
    removed: false,
  },
  fullWidthLayout: false,
  expandSidebar: true,
  notifications: {
    enabled: false,
    pollRate: 60 * 1000,
    notifRate: 10 * 60 * 1000,
  },
  displayNames: true,
  nsfwBlur: true,
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
