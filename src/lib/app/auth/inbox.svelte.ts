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
    if (!this.#profile.current.jwt) return this.clear()

    const unreads = await this.#profile.client.getUnreadCounts()

    return {
      inbox: unreads.notification_count,
      reports: unreads.report_count ?? 0,
      applications: unreads.registration_application_count ?? 0,
    }
  }
}
