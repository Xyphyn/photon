import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'
import { DEFAULT_CLIENT_TYPE, type ClientType } from '$lib/api/base'
import { client, site } from '$lib/api/client.svelte'
import type { Community, GetSiteResponse, MyUserInfo } from '$lib/api/types'
import { publishedToDate } from '$lib/ui/util/date'
import { toast } from 'mono-svelte'
import { errorMessage } from './error'
import { t } from './i18n'
import { DEFAULT_INSTANCE_URL } from './instance.svelte'
import { instanceToURL, moveItem } from './util.svelte'

function getFromStorage<T>(key: string): T | undefined {
  if (!browser) return
  const lc = localStorage.getItem(key)
  if (!lc) return undefined

  return JSON.parse(lc)
}

function setFromStorage(key: string, item: any, stringify: boolean = true) {
  if (!browser) return
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
  private static readonly DONATION_CHECK_TIMEOUT = 3 * 1000
  private static readonly DONATION_REMINDER_INTERVAL = 375 * 24 * 60 * 60 * 1000

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
  client = $derived(
    client({
      auth: this.#current.jwt,
      clientType: this.#current.client,
      instanceURL: this.#current.instance,
    }),
  )
  inbox: InboxService = $state(new InboxService(this))

  getDefaultProfile(): ProfileInfo {
    return {
      id: -1,
      instance: DEFAULT_INSTANCE_URL,
      client: DEFAULT_CLIENT_TYPE,
    }
  }

  constructor() {
    this.initCookieMigrate()
    this.donationPoll(Profile.DONATION_CHECK_TIMEOUT)
  }

  get current() {
    return this.#current
  }
  set current(value) {
    if (!value) return
    const index = this.meta.profiles.findLastIndex((i) => i.id === value.id)
    if (index != -1) this.meta.profiles[index] = value
  }

  private async initCookieMigrate() {
    if (
      !(
        env.PUBLIC_MIGRATE_COOKIE &&
        this.meta.profiles.length == 0 &&
        env.PUBLIC_INSTANCE_URL
      )
    )
      return

    const jwt = getCookie('jwt')
    if (!jwt) return
    const result = await this.add(
      jwt,
      env.PUBLIC_INSTANCE_URL ?? '',
      DEFAULT_CLIENT_TYPE,
    )

    if (result)
      toast({
        content:
          'Your instance migrated frontends, and your account was transferred.',
        type: 'success',
      })
  }

  private donationPoll(delay: number) {
    return setTimeout(() => {
      if (
        profile.current.user?.local_user_view.local_user
          .last_donation_notification
      ) {
        const donationDate = publishedToDate(
          profile.current.user?.local_user_view.local_user
            .last_donation_notification,
        )
        if (
          Date.now() - donationDate.getTime() >
          Profile.DONATION_REMINDER_INTERVAL
        ) {
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
    }, delay)
  }

  async fetchUserData() {
    const startId = this.#current.id
    if (this.#current.jwt) {
      site.data = undefined

      const res = await userFromJwt(
        this.#current.jwt,
        this.#current.instance,
        this.#current.client,
      )
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
      this.inbox.init()
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

  async add(jwt: string, instance: string, type: ClientType) {
    try {
      const user = await userFromJwt(jwt, instance, type)
      if (!user?.user) {
        throw new Error('No user data received')
      }

      const id = Math.max(...this.meta.profiles.map((p) => p.id), 0) + 1
      this.meta.profiles.unshift({
        id,
        instance,
        jwt,
        username: user.user.local_user_view.person.name,
        avatar: user.user.local_user_view.person.avatar,
        client: type,
      })
      this.meta.profile = id
      return user
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
      return null
    }
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

  isMod(community?: Community): boolean {
    if (community)
      return (
        (this.#current.user?.moderates.some(
          (i) => i.community.id == community.id,
        ) ||
          (community.local && this.isAdmin)) ??
        false
      )
    else return (this.#current.user?.moderates.length ?? 0) > 0
  }

  get isAdmin(): boolean {
    return (
      site.data?.admins.some(
        (i) => i.person.id == this.#current.user?.local_user_view.person.id,
      ) ?? false
    )
  }

  get isDefaultProfile(): boolean {
    return !this.#current.jwt && this.#current.instance == DEFAULT_INSTANCE_URL
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
      this.fetchUserData()
    })
  })
}

class InboxService {
  private readonly POLL_INTERVAL = 4 * 60 * 1000
  #pollInterval: NodeJS.Timeout | null = null

  #profile: Profile

  notifications = $state<Notifications>({
    applications: 0,
    inbox: 0,
    reports: 0,
  })

  constructor(profile: Profile) {
    this.#profile = profile
  }

  async init(): Promise<void> {
    this.cleanup()

    this.notifications = await this.checkInbox()

    this.#pollInterval = setInterval(async () => {
      this.notifications = await this.checkInbox()
    }, this.POLL_INTERVAL)
  }

  cleanup(): void {
    if (this.#pollInterval) clearInterval(this.#pollInterval)

    this.#pollInterval = null
  }

  clear(): Notifications {
    this.notifications = {
      applications: 0,
      inbox: 0,
      reports: 0,
    }
    return this.notifications
  }

  async checkInbox(): Promise<Notifications> {
    if (!this.#profile.current.user || !this.#profile.current.jwt)
      return this.clear()

    const unreadsPromise = client()
      .getUnreadCount()
      .then((res) => res.mentions + res.private_messages + res.replies)
      .catch(() => 0)

    const reportsPromise = this.#profile.isMod()
      ? client()
          .getReportCount({})
          .then(
            (res) =>
              res.comment_reports +
              res.post_reports +
              (res.private_message_reports ?? 0),
          )
          .catch(() => 0)
      : new Promise<number>((res) => res(0))

    const applicationsPromise = this.#profile.isAdmin
      ? client()
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
      inbox: unreads,
      reports: reports,
      applications: applications,
    }
  }
}

export const profile = new Profile()

// this is all garbage legacy code, remove later
async function userFromJwt(
  jwt: string,
  instance: string,
  type: ClientType,
): Promise<{ user?: MyUserInfo; site: GetSiteResponse } | undefined> {
  const sitePromise = client({
    instanceURL: instance,
    auth: jwt,
    clientType: type,
  }).getSite()

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
