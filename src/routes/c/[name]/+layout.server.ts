import { lemmy } from '$lib/lemmy.js';
import { error } from '@sveltejs/kit';

export function load({ params }) {
    return lemmy.getCommunity({ name: params.name })
}