import { client } from '$lib/api/client.svelte'
import { type ModlogKind } from '$lib/api/types'
import { urlParam } from '$lib/app/util/params'

export async function load({ url, fetch }) {
  const community = urlParam.number(url, 'community')
  const user = urlParam.number(url, 'user')
  const modId = urlParam.number(url, 'mod_id')
  const postId = urlParam.number(url, 'post')
  const commentId = urlParam.number(url, 'comment')

  const cursor = urlParam.optional(url, 'cursor')
  const type = urlParam.optional<ModlogKind>(url, 'type')

  const results = await client({
    func: fetch,
  }).getModlog({
    community_id: community,
    limit: 50,
    type_: type,
    page_cursor: cursor,
    mod_person_id: modId,
    other_person_id: user,
    post_id: postId,
    comment_id: commentId,
  })

  return {
    params: {
      user: user,
      community: community,
      moderator: modId,
      post: postId,
      comment: commentId,
      next: results.next_page,
      prev: results.prev_page,
      type: type,
    },
    type: type,
    modlog: results.items,
  }
}
