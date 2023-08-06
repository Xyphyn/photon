import { getClient } from '$lib/lemmy.js'
import type { Result } from '$lib/lemmy/item.js'
import type {
  CommentReplyView,
  Person,
  PersonMentionView,
  PersonView,
  PrivateMessageView,
} from 'lemmy-js-client'

export type InboxItemView =
  | PersonMentionView
  | CommentReplyView
  | PrivateMessageView

export function getInboxItemPublished(item: InboxItemView): string {
  if ('comment_reply' in item) {
    return item.comment_reply.published
  }

  if ('private_message' in item) {
    return item.private_message.published
  }

  return item.person_mention.published
}

export function isRead(
  item: PersonMentionView | CommentReplyView | PrivateMessageView
) {
  if ('person_mention' in item) {
    return (item as PersonMentionView).person_mention.read
  }

  if ('comment_reply' in item) {
    return (item as CommentReplyView).comment_reply.read
  }

  if ('private_message' in item) {
    return (item as PrivateMessageView).private_message.read
  }

  return false
}

export const getInbox = async (
  jwt: string,
  until?: number
): Promise<InboxItem[]> => {
  const client = getClient()

  const params = {
    limit: 50,
    auth: jwt,
    unread_only: true,
  }

  const [replies, mentions, privateMessages] = await Promise.all([
    client.getReplies({
      ...params,
      sort: 'New',
    }),
    client.getPersonMentions({
      ...params,
      sort: 'New',
    }),
    client.getPrivateMessages({ ...params }),
  ])

  let items = [
    ...replies.replies,
    ...mentions.mentions,
    ...privateMessages.private_messages,
  ]
    .map(toInboxItem)
    .sort((a, b) => b.created - a.created)

  if (until) {
    items = items.filter((item) => item.created > until)
  }

  return items
}

const toInboxItem = (item: InboxItemView): InboxItem => {
  let type: 'private_message' | 'comment_reply' | 'person_mention'
  let body: string
  let personView: Person
  let created: number
  if ('comment_reply' in item) {
    type = 'comment_reply'
    body = item.comment.content
    personView = item.creator
    created = Date.parse(`${item.comment_reply.published}Z`)
  } else if ('person_mention' in item) {
    type = 'person_mention'
    body = item.comment.content
    personView = item.creator
    created = Date.parse(`${item.person_mention.published}Z`)
  } else if ('private_message' in item) {
    type = 'private_message'
    body = item.private_message.content
    personView = item.creator
    created = Date.parse(`${item.private_message.published}Z`)
  } else {
    throw new Error('Invalid item')
  }

  return {
    type: type,
    body: body,
    person: personView,
    created,
  }
}

interface InboxItem {
  type: 'private_message' | 'comment_reply' | 'person_mention'
  body: string
  person: Person
  created: number
}
