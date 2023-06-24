import { lemmy } from '$lib/lemmy.js';

export function load({ params }) {
    return lemmy.getCommunity({ name: params.name })
}