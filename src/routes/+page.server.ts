import { lemmy } from '$lib/lemmy.js'

export function load(req) {
  const page = Number(req.url.searchParams.get('page') || 1) || 1
  console.log(page)
  return lemmy.getPosts({
    limit: 40,
    page: page,
    sort: 'Active',
    type_: 'Local',
  })
}
