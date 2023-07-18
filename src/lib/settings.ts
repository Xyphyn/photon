import { writable } from 'svelte/store'

interface Settings {
  newComments: boolean
  expandableImages: boolean
  markReadPosts: boolean
  instance?: string
  revertColors: boolean
  showInstance: boolean
}

const defaultSettings: Settings = {
  newComments: true,
  expandableImages: true,
  markReadPosts: true,
  revertColors: false,
  showInstance: false,
}

export const userSettings = writable(defaultSettings)

function mergeObjects<T>(obj1: any, obj2: any): T {
  for (let prop in obj2) {
    if (!(prop in obj1) || obj1[prop] == null || obj2[prop] == '') {
      obj1[prop] = obj2[prop]
    }
  }
  return obj1
}

if (typeof window != 'undefined') {
  let oldUserSettings = JSON.parse(
    localStorage.getItem('settings') ?? JSON.stringify(defaultSettings)
  )

  userSettings.set(mergeObjects<Settings>(oldUserSettings, defaultSettings))
}

userSettings.subscribe((settings) => {
  if (typeof window != 'undefined') {
    localStorage.setItem('settings', JSON.stringify(settings))
  }
})
