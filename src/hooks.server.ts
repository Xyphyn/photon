import { locale } from 'svelte-i18n'

function buildUrl(inputUrl: URL): URL {
  let withoutCors = inputUrl.pathname.replace('/cors/', '')

  if (!withoutCors.startsWith('https://')) {
    withoutCors = 'https://' + withoutCors
  }

  return new URL(`${withoutCors}?${inputUrl.searchParams.toString()}`)
}

export function handleError({ error, event }) {
  console.error(error)
  return {
    message: 'There was an error during rendering',
  }
}

export async function handle({ event, resolve }) {
  const lang = event.request.headers.get('accept-language')?.split(',')[0]
  if (lang) {
    locale.set(lang)
  }
  // annoying hack to fix lemmy's CORS
  if (event.url.pathname.startsWith('/cors')) {
    event.request.headers.delete('origin')
    event.request.headers.delete('host')

    try {
      const url = buildUrl(event.url)

      let headers: Headers = event.request.headers

      headers.delete('origin')
      headers.delete('host')

      if (
        event.request.method == 'POST' &&
        url.pathname == '/pictrs/image' &&
        url.searchParams.get('auth')
      ) {
        headers.set('cookie', `jwt=${url.searchParams.get('auth')}`)
      } else {
        return new Response(
          JSON.stringify({
            message: 'Only CORS allowed is through /pictrs/image',
          }),
          {
            status: 500,
          }
        )
      }

      const data = await fetch(url, {
        method: event.request.method,
        headers: headers,
        body: event.request.body,
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
      console.log(error)
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

  return resolve(event)
}
