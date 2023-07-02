import { getClient } from '$lib/lemmy.js'
import { error } from '@sveltejs/kit'

export async function POST(event) {
  try {
    const text = await event.request.text()
    const instance = new URL(`https://${text}`)

    event.cookies.set('instance_url', instance.hostname)

    return new Response(instance.hostname)
  } catch (err) {
    throw error(400, 'Invalid URL')
  }
}
