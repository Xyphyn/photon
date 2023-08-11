import { redirect } from '@sveltejs/kit'

export const load = async () => {
  throw redirect(300, '/profile/user')
}
