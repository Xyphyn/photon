import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'
import { amModOfAny, isAdmin } from '$comp/lemmy/moderation/moderation.js'
import { DEFAULT_INSTANCE_URL } from '$lib/instance.svelte.js'
import { client, getClient, site } from '$lib/client/lemmy.svelte'
import { instanceToURL, moveItem } from '$lib/util.svelte'
import { toast } from 'mono-svelte'
import { writable } from 'svelte/store'
import { t } from './i18n/translations'
import { errorMessage } from './lemmy/error'
import { publishedToDate } from './components/util/date'
import type { Community, GetSiteResponse, MyUserInfo } from './client/types'
import { DEFAULT_CLIENT_TYPE, type ClientType } from './client/base'

function getFromStorage<T>(key: string): T | undefined {
  if (typeof localStorage == 'undefined') return undefined
  const lc = localStorage.getItem(key)
  if (!lc) return undefined

  return JSON.parse(lc)
}

function setFromStorage(key: string, item: any, stringify: boolean = true) {
  if (typeof localStorage == 'undefined') return
  return localStorage.setItem(key, stringify ? JSON.stringify(item) : item)
}

export interface ProfileInfo {
  id: number
  instance: string
  jwt?: string
  user?: MyUserInfo
  username?: string
  avatar?: string
  favorites?: Community[]
  color?: string
  client: ClientType
}

/**
 * What gets stored in localstorage.
 */
interface ProfileData {
  profiles: ProfileInfo[]
  // should be named currentId
  profile: number
}

interface Notifications {
  inbox: number
  reports: number
  applications: number
}

const getCookie = (key: string): string | undefined => {
  if (!browser) return undefined

  return document?.cookie
    ?.split(';')
    .map((c) => c.trim())
    .find((c) => c.split('=')?.[0] == key)
    ?.split('=')?.[1]
}

class Profile {
  meta = $state<ProfileData>(
    getFromStorage<ProfileData>('profileData') ?? {
      profiles: [
        {
          id: 1,
          instance: DEFAULT_INSTANCE_URL,
          username: 'Guest',
          color: '#505050',
          client: DEFAULT_CLIENT_TYPE,
        },
      ],
      profile: 1,
    },
  )
  #current = $derived(
    this.meta.profiles.find((i) => i.id == this.meta.profile) ??
      this.getDefaultProfile(),
  )

  getDefaultProfile(): ProfileInfo {
    return {
      id: -1,
      instance: DEFAULT_INSTANCE_URL,
      client: DEFAULT_CLIENT_TYPE,
    }
  }

  constructor() {
    // cookie migration code
    if (
      env.PUBLIC_MIGRATE_COOKIE &&
      this.meta.profiles.length == 0 &&
      env.PUBLIC_INSTANCE_URL
    ) {
      const jwt = getCookie('jwt')
      if (jwt) {
        ;(async () => {
          const result = await this.add(
            jwt,
            env.PUBLIC_INSTANCE_URL ?? '',
            DEFAULT_CLIENT_TYPE,
          )

          if (result)
            toast({
              content:
                'Your instance migrated to Photon, and your account was transferred.',
              type: 'success',
            })
        })()
      }
    }

    setInterval(
      () => {
        if (profile.current.jwt)
          this.checkInbox().then((res) => notifications.update(() => res))
      },
      4 * 60 * 1000,
    )

    // hacky way to check donation status
    setTimeout(() => {
      if (
        profile.current.user?.local_user_view.local_user
          .last_donation_notification
      ) {
        const donationDate = publishedToDate(
          profile.current.user?.local_user_view.local_user
            .last_donation_notification,
        )
        if (Date.now() - donationDate.getTime() > 365 * 24 * 60 * 60 * 1000) {
          toast({
            content: t.get('toast.lemmyDonate'),
            duration: 3600 * 1000,
            long: true,
          })

          // lemmy js client donation dialog is broken
          fetch(
            `${instanceToURL(profile.current.instance)}/api/v3/user/donation_dialog_shown`,
            {
              method: 'POST',
              headers: {
                authorization: `Bearer ${profile.current.jwt}`,
              },
            },
          )
        }
      }
    }, 3 * 1000)
  }

  get current() {
    return this.#current
  }
  set current(value) {
    if (!value) return
    const index = this.meta.profiles.findIndex((i) => i.id == value?.id)
    this.meta.profiles[index] = value
  }

  async fetchUserData() {
    const startId = this.#current.id
    if (this.#current.jwt) {
      site.data = undefined
      notifications.set({ applications: 0, inbox: 0, reports: 0 })

      const res = await userFromJwt(this.#current.jwt, this.#current.instance)
      if (!res?.user)
        toast({
          content:
            "Your account's instance did not return your user data. Your login may have expired.",
          type: 'error',
        })

      // TODO update authentication handling to not be this dynamic
      if (this.#current.id != startId) {
        console.error('profile was switched too fast, ID mismatch')
        return
      }

      site.data = res?.site
      this.#current.user = res?.user
      if (profile.current.user) {
        this.#current.avatar = res?.user?.local_user_view.person.avatar
        this.#current.username = res?.user?.local_user_view.person.name
      }
    } else {
      if (browser) {
        site.data = undefined
        client({ instanceURL: this.#current.instance })
          .getSite()
          .then((res) => (site.data = res))
      }
    }

    return this
  }

  async checkInbox() {
    const { user, jwt } = profile.current
    if (!user || !jwt) throw new Error('checkInbox() called with invalid user')

    const notifs = await getNotificationCount(
      jwt,
      amModOfAny(user) ?? false,
      user ? isAdmin(user) : false,
    )

    return {
      inbox: notifs.unreads,
      applications: notifs.applications,
      reports: notifs.reports,
    }
  }

  async add(jwt: string, instance: string, type: ClientType) {
    const user = await userFromJwt(jwt, instance)
      .then((u) => u)
      .catch((err) => {
        toast({ content: errorMessage(err as string), type: 'error' })
      })
    if (!user?.user) {
      toast({
        content: "Your instance's API did not return your user data.",
        type: 'error',
      })
    }

    const id = Math.max(...this.meta.profiles.map((p) => p.id)) + 1
    this.meta.profile = id
    this.meta.profiles.unshift({
      id: id,
      instance: instance,
      jwt: jwt,
      username: user?.user?.local_user_view.person.name,
      avatar: user?.user?.local_user_view.person.avatar,
      client: type,
    })

    return user
  }

  remove(id: number) {
    this.meta.profiles.splice(
      this.meta.profiles.findIndex((p) => p.id == id),
      1,
    )
    if (id == this.meta.profile) this.meta.profile = -1
  }

  move(id: number, up: boolean) {
    try {
      const index = this.meta.profiles.findIndex((i) => i.id == id)
      this.meta.profiles = moveItem(
        this.meta.profiles,
        index,
        index + (up ? -1 : 1),
      )
    } catch {
      /* empty */
    }
  }

  mainEffect = $effect.root(() => {
    // Sync with localStorage
    $effect(() => {
      const serialized = {
        ...this.meta,
        profiles: this.meta.profiles.map((p) => serializeUser(p)),
      }

      setFromStorage('profileData', serialized)

      // no more profiles left
      if (serialized.profiles.length == 0) {
        this.meta.profiles = [this.getDefaultProfile()]
        this.meta.profile = 1
      }
    })

    $effect(() => {
      this.fetchUserData().then(() => {
        if (this.current.jwt)
          this.checkInbox().then((res) => notifications.update(() => res))
      })
    })
  })
}

export const profile = new Profile()

export const notifications = writable<Notifications>({
  applications: 0,
  inbox: 0,
  reports: 0,
})

async function userFromJwt(
  jwt: string,
  instance: string,
): Promise<{ user?: MyUserInfo; site: GetSiteResponse } | undefined> {
  const sitePromise = client({ instanceURL: instance, auth: jwt }).getSite()

  const timer = setTimeout(
    () =>
      toast({
        content: `Still loading your user data...`,
        type: 'warning',
        loading: true,
      }),
    5000,
  )

  const site = await sitePromise
    .then((r) => {
      clearTimeout(timer)
      return r
    })
    .catch((e) => {
      toast({ content: `Failed to contact the instance. ${e}` })
    })

  if (!site) return

  const myUser = site.my_user

  return {
    user: myUser,
    site: site,
  }
}

function serializeUser(user: ProfileInfo): ProfileInfo {
  return {
    ...user,
    user: undefined,
  }
}

async function getNotificationCount(jwt: string, mod: boolean, admin: boolean) {
  const unreadsPromise = getClient()
    .getUnreadCount()
    .then((res) => res.mentions + res.private_messages + res.replies)
    .catch(() => 0)

  const reportsPromise = mod
    ? getClient()
        .getReportCount({})
        .then(
          (res) =>
            res.comment_reports +
            res.post_reports +
            (res.private_message_reports ?? 0),
        )
        .catch(() => 0)
    : new Promise<number>((res) => res(0))

  const applicationsPromise = admin
    ? getClient()
        .getUnreadRegistrationApplicationCount()
        .then((res) => res.registration_applications)
        .catch(() => 0)
    : new Promise<number>((res) => res(0))

  const [unreads, reports, applications] = await Promise.all([
    unreadsPromise,
    reportsPromise,
    applicationsPromise,
  ])

  return {
    unreads: unreads,
    reports: reports,
    applications: applications,
  }
}
