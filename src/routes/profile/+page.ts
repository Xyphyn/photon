import { redirect } from '@sveltejs/kit'

export const load = async () => {
  redirect(300, '/profile/user');
}
