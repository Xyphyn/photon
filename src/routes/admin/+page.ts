import { redirect } from '@sveltejs/kit'

export const load = () => {
  throw redirect(300, '/admin/config')
}
