import { client } from '$lib/api/client.svelte'
import type { NotificationView } from 'lemmy-js-client'
import { postLink } from '../post'

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

  get link() {
    switch (this.data.type_) {
      case 'comment':
        return `/comment/${this.data.comment.id}`
      case 'post':
        return postLink(this.data.post)
      case 'private_message':
        return `/inbox/messages/${this.data.private_message.creator_id}`
      // TODO make a precise modlog link
      case 'mod_action':
        return `/modlog?user=${this.data.target_person?.id}`
    }
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
