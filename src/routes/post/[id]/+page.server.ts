import { getClient } from '$lib/lemmy.js'

export async function load({ params, cookies }) {
  return {
    post: await getClient(cookies.get('instance_url')).getPost({
      id: Number(params.id),
    }),
    comments: await getClient(cookies.get('instance_url')).getComments({
      post_id: Number(params.id),
      type_: 'All',
      limit: 250,
      page: 1,
      max_depth: 6,
      saved_only: false,
      sort: 'Hot',
    }),
  }
}
