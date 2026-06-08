import { client } from '$lib/api/client.svelte'
import type { NotificationView } from 'lemmy-js-client'

export class InboxItemModel {
  #data: NotificationView

  constructor(init: NotificationView) {
    this.#data = $state(init)
  }

  get data() {
    return this.#data.data
  }

  get notification() {
    return this.#data.notification
  }

  get read() {
    return this.notification.read
  }

  async markRead(read: boolean = !this.read) {
    return await client()
      .markNotificationAsRead({
        type_: this.notification.kind,
        notification_id: this.notification.id,
        read: read,
      })
      .then((i) => {
        if (i.success) this.#data.notification.read = read
      })
  }
}
