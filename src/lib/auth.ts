import { ToastType, toast } from '$lib/components/ui/toasts/toasts.js'
import { DEFAULT_INSTANCE_URL, getClient, instance } from '$lib/lemmy.js'
import type { MyUserInfo } from 'lemmy-js-client'
import { get, writable } from 'svelte/store'

function getFromStorage<T>(key: string): T | undefined {
  if (typeof localStorage == 'undefined') return undefined
  const lc = localStorage.getItem(key)
  if (!lc) return undefined

  return JSON.parse(lc)
}

function setFromStorage(key: string, item: any) {
  if (typeof localStorage == 'undefined') return
  return localStorage.setItem(key, JSON.stringify(item))
}

interface Profile {
  id: number
  instance: string
  jwt?: string
  user?: PersonData
  username?: string
}

/**
 * What gets stored in localstorage.
 */
interface ProfileData {
  profiles: Profile[]
  profile: number
  defaultInstance?: string
}

interface PersonData extends MyUserInfo {
  unreads: number
  reports: number
}

export const profileData = writable<ProfileData>(
  getFromStorage<ProfileData>('profileData') ?? { profiles: [], profile: -1 }
)

let initialInstance = get(profileData).defaultInstance

profileData.subscribe(async (pd) => {
  setFromStorage('profileData', pd)

  if (pd.profile == -1 && pd.defaultInstance != initialInstance) {
    initialInstance = get(profileData).defaultInstance ?? DEFAULT_INSTANCE_URL
    instance.set(get(profileData).defaultInstance ?? DEFAULT_INSTANCE_URL)
  }
})

export const profile = writable<Profile | undefined>(getProfile())

profile.subscribe(async (p) => {
  if (p?.id == -1) {
    instance.set(get(profileData).defaultInstance ?? DEFAULT_INSTANCE_URL)
  }
  if (!p || !p.jwt) {
    profileData.update((pd) => ({ ...pd, profile: -1 }))
    return
  }
  if (p.user) return

  instance.set(p.instance)
  // fetch the user because p.user is undefined
  const user = await userFromJwt(p.jwt, p.instance)

  profile.update(() => ({
    ...p,
    user: user,
  }))
})

export async function setUser(jwt: string, instance: string, username: string) {
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
      username: username,
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

function getProfile() {
  const id = get(profileData).profile

  if (id == -1) {
    return
  }

  const pd = get(profileData)

  return pd.profiles.find((p) => p.id == id)
}

const getDefaultProfile = () => ({
  id: -1,
  instance: get(instance),
})

export function resetProfile() {
  profile.set(getDefaultProfile())
  profileData.update((p) => ({ ...p, profile: -1 }))
}

export function deleteProfile(id: number) {
  const pd = get(profileData)

  const index = pd.profiles.findIndex((p) => p.id == id)
  if (index <= -1) return

  pd.profiles.splice(index, 1)

  profileData.update((p) => ({
    ...p,
    profiles: pd.profiles,
  }))

  if (id == get(profile)?.id) {
    resetProfile()
  }
}

export function setUserID(id: number) {
  const pd = get(profileData)
  if (id == -1) {
    resetProfile()
    return
  }
  const prof = pd.profiles.find((p) => p.id == id)

  profile.set(prof ?? getDefaultProfile())
  profileData.update((p) => ({ ...p, profile: id }))

  return prof
}
