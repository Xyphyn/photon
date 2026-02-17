import { PiefedClient } from '$lib/api/piefed/adapter'
import type { Profile } from './profile.svelte'

interface Notifications {
  inbox: number
  reports: number
  applications: number
}

export class InboxService {
  private readonly POLL_INTERVAL = 4 * 60 * 1000
  #pollInterval: ReturnType<typeof setInterval> | null = null

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

    const unreadsPromise = this.#profile.client
      .getUnreadCount()
      .then((res) => res.mentions + res.private_messages + res.replies)
      .catch(() => 0)

    const reportsPromise =
      !(this.#profile.client instanceof PiefedClient) && this.#profile.isMod()
        ? this.#profile.client
            .getReportCount({})
            .then(
              (res) =>
                res.comment_reports +
                res.post_reports +
                (res.private_message_reports ?? 0),
            )
            .catch(() => 0)
        : Promise.resolve(0)

    const applicationsPromise =
      !(this.#profile.client instanceof PiefedClient) && this.#profile.isAdmin
        ? this.#profile.client
            .getUnreadRegistrationApplicationCount()
            .then((res) => res.registration_applications)
            .catch(() => 0)
        : Promise.resolve(0)

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
