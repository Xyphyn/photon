function buildUrl(inputUrl: URL): URL {
  let withoutCors = inputUrl.pathname.replace('/cors/', '')

  if (!withoutCors.startsWith('https://')) {
    withoutCors = 'https://' + withoutCors
  }

  return new URL(`${withoutCors}?${inputUrl.searchParams.toString()}`)
}

export function handleError({ error, event }) {
  return {
    message: 'There was an error during rendering',
  }
}

export async function handle({ event, resolve }) {
  // annoying hack to fix lemmy's CORS
  if (event.url.pathname.startsWith('/cors')) {
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

      const json = await data.json()

      return new Response(JSON.stringify(json), {
        status: data.status,
      })
    } catch (error) {
      return new Response(
        JSON.stringify({
          message: 'the proxy failed to fetch from server',
        }),
        {
          status: 200,
        }
      )
    }
  }

  const response = await resolve(event)
  return response
}
