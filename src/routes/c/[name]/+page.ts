import { redirect } from '@sveltejs/kit';

export function load({ params }) {
    throw redirect(300, `/c/${params.name}/posts`)
}