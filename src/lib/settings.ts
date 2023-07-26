import { writable } from 'svelte/store'

interface Settings {
  newComments: boolean
  expandableImages: boolean
  markReadPosts: boolean
  instance?: string
  revertColors: boolean
  showInstance: boolean
  defaultSort: {
    sort: 'Hot' | 'TopAll' | 'Active' | 'New'
    feed: 'All' | 'Subscribed' | 'Local'
  }
}

const defaultSettings: Settings = {
  newComments: true,
  expandableImages: true,
  markReadPosts: true,
  revertColors: false,
  showInstance: false,
  defaultSort: {
    sort: 'Active',
    feed: 'Local',
  },
}

export const userSettings = writable(defaultSettings)

if (typeof window != 'undefined') {
  let oldUserSettings = JSON.parse(
    localStorage.getItem('settings') ?? JSON.stringify(defaultSettings)
  )

  userSettings.set({...defaultSettings, ...oldUserSettings})
}

userSettings.subscribe((settings) => {
  if (typeof window != 'undefined') {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
})
