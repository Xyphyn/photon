import { error } from '@sveltejs/kit'

function buildUrl(inputUrl: URL): URL {
  let withoutCors = inputUrl.pathname.replace('/cors/', '')

  if (!withoutCors.startsWith('https://')) {
    withoutCors = 'https://' + withoutCors
  }

  return new URL(`${withoutCors}?${inputUrl.searchParams.toString()}`)
}

export async function handleError() {
  return {
    message: 'The proxy failed to fetch from that URL',
  }
}

export async function handle({ event, resolve }) {
  // annoying hack to fix lemmy's CORS
  if (event.url.pathname.startsWith('/cors')) {
    // cut off the 1st slash (empty), and remove the /cors
    event.request.headers.delete('origin')
    event.request.headers.delete('host')

    try {
      const url = buildUrl(event.url)

      const data = await fetch(url, {
        method: event.request.method,
        body: event.request.body,
        headers: event.request.headers,
        // @ts-ignore this works, idk why typescript complains
        duplex: 'half',
        signal: AbortSignal.timeout(20 * 1000),
      }).catch((_) => undefined)

      if (!data) {
        return new Response(
          JSON.stringify({
            message: 'proxy failed to fetch',
          }),
          {
            status: 500,
          }
        )
      }

      if (!data.ok) {
        return new Response(
          JSON.stringify({
            message: await data.text(),
          }),
          {
            status: data.status,
          }
        )
      }

      try {
        const json = await data.json()

        return new Response(JSON.stringify(json), {
          status: data.status,
        })
      } catch (error) {
        console.log('Caught the thing')

        return new Response(JSON.stringify({ message: 'i hate everything' }), {
          status: 500,
        })
      }
    } catch (error) {
      console.log('caught it')
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
