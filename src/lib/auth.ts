import { amModOfAny } from '$lib/components/lemmy/moderation/moderation.js'
import { toast } from '$lib/components/ui/toasts/toasts.js'
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
  favorites?: number[]
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

// stupid hack to get dev server working
// why does this always happen to me

let initialInstance = get(profileData).defaultInstance

profileData.subscribe(async (pd) => {
  setFromStorage('profileData', pd)

  if (pd.profile == -1 && initialInstance != pd.defaultInstance) {
    initialInstance = get(profileData).defaultInstance ?? DEFAULT_INSTANCE_URL
    instance?.set(get(profileData).defaultInstance ?? DEFAULT_INSTANCE_URL)
  }
})

export const profile = writable<Profile | undefined>(getProfile())

profile.subscribe(async (p) => {
  if (p?.id == -1) {
    instance?.set(get(profileData).defaultInstance ?? DEFAULT_INSTANCE_URL)
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

export async function setUser(jwt: string, inst: string, username: string) {
  try {
    new URL(`https://${inst}`)
  } catch (err) {
    return
  }

  const user = await userFromJwt(jwt, inst)
  if (!user) {
    toast({
      content: 'Failed to fetch your user. Is your instance down?',
      type: 'error',
    })
  }

  instance.set(inst)

  profileData.update((pd) => {
    // too lazy to make a decent system
    const id = Math.floor(Math.random() * 100000)

    const newProfile: Profile = {
      id: id,
      instance: inst,
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

  return user
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

function getProfile() {
  const id = get(profileData).profile

  if (id == -1) {
    return getDefaultProfile()
  }

  const pd = get(profileData)

  return pd.profiles.find((p) => p.id == id)
}

function getDefaultProfile() {
  return {
    id: -1,
    instance: get(profileData)?.defaultInstance ?? get(instance),
  }
}

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

setInterval(async () => {
  if (!get(profile)) return

  const { user, jwt } = get(profile)!
  if (!jwt || !user) return

  const response = await getClient().getUnreadCount({
    auth: jwt,
  })

  user.unreads =
    response.mentions + response.private_messages + response.replies

  if (amModOfAny(user)) {
    const reports = await getClient().getReportCount({
      auth: jwt,
    })

    user.reports =
      reports.comment_reports +
      reports.post_reports +
      (reports.private_message_reports ?? 0)
  }

  profile.update((p) => ({
    ...p!,
    user: user,
  }))
}, 30 * 1000)
