import { lemmy } from '$lib/lemmy.js';

export function load({ params }) {
    return lemmy.getPosts({ limit: 20, community_name: params.name, page: 1, })
}