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
    sort: 'Hot' | 'TopAll' | 'Active' | 'New'
    feed: 'All' | 'Subscribed' | 'Local'
  }
  fullWidthLayout: boolean
}

const defaultSettings: Settings = {
  newComments: true,
  expandableImages: true,
  markReadPosts: true,
  revertColors: false,
  showInstances: {
    user: false,
    community: false,
    comments: false,
  },
  showCompactPosts: false,
  defaultSort: {
    sort: 'Active',
    feed: 'Local',
  },
  fullWidthLayout: false,
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
