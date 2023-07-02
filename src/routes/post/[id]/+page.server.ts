import { lemmy } from '$lib/lemmy.js'

export async function load({ params }) {
  return {
    post: await lemmy.getPost({ id: Number(params.id) }),
    comments: await lemmy.getComments({
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
