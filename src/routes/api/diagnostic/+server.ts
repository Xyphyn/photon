import type { RequestHandler } from '@sveltejs/kit'
import { env as envPrivate } from '$env/dynamic/private'

// this is a very rudimentary 'security' system.
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
  const body = await request.json()

  const payload = {
    theme: body.theme,
    profiles: body.profiles,
    settings: body.settings,
  }

  await fetch(envPrivate.PRIVATE_DIAGNOSTICS_URL, {
    body: JSON.stringify(payload),
    headers: {
      Authorization: envPrivate.PRIVATE_DIAGNOSTIC_KEY,
      'Content-Type': 'application/json',
      // so that any upstream diagnostic server can handle abuse
      'x-forwarded-for': getClientAddress(),
    },
  })

  return new Response(JSON.stringify({ success: true, storedData: payload }))
}
