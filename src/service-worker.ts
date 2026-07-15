/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker'

const CACHE = `cache-${version}`
const ASSETS = [...build, ...files]

self.addEventListener('install', (event) => {
  console.info('[i] Installing service worker')

  async function addFilesToCache() {
    const cache = await caches.open(CACHE)
    await cache.addAll(ASSETS)
  }

  event.waitUntil(addFilesToCache())
})

self.addEventListener('activate', (event) => {
  console.info('[i] Activating service worker')

  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key)
    }
  }

  event.waitUntil(deleteOldCaches())
})

self.addEventListener('fetch', (e) => {
  const event = e as FetchEvent
  if (event.request.method !== 'GET') return

  async function respond() {
    const url = new URL(event.request.url)
    const cache = await caches.open(CACHE)

    // Bypass completely for API calls
    if (url.pathname.includes('/api/')) {
      try {
        return await fetch(event.request)
      } catch {
        return new Response(JSON.stringify({ error: 'Offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }

    if (ASSETS.includes(url.pathname)) {
      const cachedResponse = await cache.match(event.request)
      if (cachedResponse) return cachedResponse
    }

    try {
      const response = await fetch(event.request)

      if (!(response instanceof Response)) {
        throw new Error('invalid response from fetch')
      }

      const isHtmlResponse = response.headers
        .get('content-type')
        ?.includes('text/html')
      const isAsset =
        url.pathname.endsWith('.js') || url.pathname.endsWith('.css')
      const isLocal = url.origin === self.location.origin

      if (response.status === 200 && isLocal && !isHtmlResponse && !isAsset) {
        cache.put(event.request, response.clone())
      }

      return response
    } catch (err) {
      // Fallback to cache if network is unavailable
      const cachedResponse = await cache.match(event.request)
      if (cachedResponse) return cachedResponse

      throw err
    }
  }

  event.respondWith(respond())
})
