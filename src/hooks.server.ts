import { error } from '@sveltejs/kit'

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

    try {
      const data = await fetch(`https://${instance}/${url.toString()}`, {
        method: event.request.method,
        body: event.request.body,
        headers: event.request.headers,
        // @ts-ignore this works, idk why typescript complains
        duplex: 'half',
        signal: AbortSignal.timeout(20 * 1000),
      })

      const json = await data.json()

      return new Response(JSON.stringify(json))
    } catch (error) {
      console.error(error)
      return new Response(
        JSON.stringify({
          message: 'the proxy failed to fetch from server',
        }),
        {
          status: 500,
        }
      )
    }
  }
  const response = await resolve(event)
  return response
}
