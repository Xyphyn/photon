import { redirect } from '@sveltejs/kit'

export const load = () => {
  redirect(300, '/admin/config');
}
