import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
import { DEFAULT_INSTANCE_URL, getClient } from '$lib/lemmy.js'
import type { MyUserInfo } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'

function getFromStorage<T>(key: string): T | undefined {
  const lc = localStorage.getItem(key)
  if (!lc) return undefined

  return JSON.parse(lc)
}

function setFromStorage(key: string, item: any) {
  return localStorage.setItem(key, JSON.stringify(item))
}

interface Profile {
  id: number
  instance: string
  jwt?: string
  user?: PersonData
}

/**
 * What gets stored in localstorage.
 */
interface ProfileData {
  profiles: Profile[]
  profile: number
}

interface PersonData extends MyUserInfo {
  unreads: number
  reports: number
}

export const profileData = writable<ProfileData>({ profiles: [], profile: -1 })
export const profile = writable<Profile | undefined>({
  id: -1,
  instance: DEFAULT_INSTANCE_URL,
})

profileData.subscribe((pd) => {
  setFromStorage('profileData', pd)
})

profile.subscribe(async (p) => {
  if (!p || !p.jwt) {
    profileData.update((pd) => ({ ...pd, profile: -1 }))
    return
  }
  if (p.user) return

  // fetch the user because p.user is undefined
  const user = await userFromJwt(p.jwt, p.instance)

  p = {
    ...p,
    user: user,
  }
})

export async function setUser(jwt: string, instance: string) {
  try {
    new URL(`https://${instance}`)
  } catch (err) {
    return
  }

  const user = await userFromJwt(jwt, instance)
  if (!user) {
    toast({
      content: 'Failed to fetch your user. Is your instance down?',
      type: ToastType.error,
    })
  }

  profileData.update((pd) => {
    // too lazy to make a decent system
    const id = Math.floor(Math.random() * 100000)

    const newProfile: Profile = {
      id: id,
      instance: instance,
      jwt: jwt,
    }

    profile.set({
      ...newProfile,
      user: user,
    })

    return {
      profile: id,
      profiles: [...pd.profiles, newProfile],
    }
  })
}

async function userFromJwt(
  jwt: string,
  instance: string
): Promise<PersonData | undefined> {
  const myUser = (await getClient(instance).getSite({ auth: jwt })).my_user
  if (!myUser) return undefined

  return {
    unreads: 0,
    reports: 0,
    ...myUser,
  }
}

const userToPersonData = (user: MyUserInfo): PersonData => ({
  ...user,
  unreads: 0,
  reports: 0,
})

function getProfileData() {
  const pd = getFromStorage<ProfileData>('profileData')!

  profileData.set(pd)

  console.log(get(profileData))
}

getProfileData()
