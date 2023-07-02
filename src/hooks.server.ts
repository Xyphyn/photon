import { instance_url } from '$lib/lemmy.js'

export async function handle({ event, resolve }) {
  // annoying hack to fix lemmy's CORS
  if (event.url.pathname.startsWith('/cors')) {
    const instance = `${event.url.pathname.split('/')[2]}`
    const url = `${event.url.pathname
      .split('/')
      .slice(3)
      .join('/')}?${event.url.searchParams.toString()}`

    event.request.headers.delete('origin')
    event.request.headers.delete('host')

    const data = await fetch(`https://${instance}/${url.toString()}`, {
      method: event.request.method,
      body: event.request.body,
      headers: event.request.headers,
    })

    return new Response(JSON.stringify(await data.json()))
  }

  const response = await resolve(event)
  return response
}
