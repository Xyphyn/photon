import { client } from '$lib/api/client.svelte'
import {
  Profile,
  type ProfileData,
  type ProfileInfo,
} from '$lib/app/auth.svelte'
import type { Cookies } from '@sveltejs/kit'
import type { GetSiteResponse } from 'lemmy-js-client'
import { defaultSettings, type Settings } from '../settings.svelte'

export interface UserDataJson {
  meta: ProfileData
  profile: ProfileInfo
  site: GetSiteResponse
  settings: Settings
}

export interface UserDataUi {
  profile: Profile
  site: GetSiteResponse
  settings: Settings
}

export async function initDataCookie(cookies: Cookies): Promise<UserDataJson> {
  const profileCookie = cookies.get('profileData')
  const profileData: ProfileData = profileCookie
    ? JSON.parse(profileCookie)
    : {
        profile: -1,
        profiles: [Profile.getDefaultProfile()],
      }

  const currentProfileIndex =
    profileData.profiles.findIndex((i) => i.id == profileData.profile) ?? 0

  const settingsCookie = cookies.get('settings')
  const settingsData: Settings = settingsCookie
    ? JSON.parse(settingsCookie)
    : defaultSettings

  const site = await client({
    profile: profileData.profiles[currentProfileIndex]!,
  }).getSite()

  profileData.profiles[currentProfileIndex].user = site.my_user

  return {
    profile: profileData.profiles[currentProfileIndex]!,
    meta: profileData,
    settings: settingsData,
    site: site,
  }
}
