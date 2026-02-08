import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { env } from '$env/dynamic/public'
import { client } from '$lib/api/client.svelte'
import type { Community, Person } from '$lib/api/types'
import { SvelteURL } from 'svelte/reactivity'
import { t } from './i18n'

// Despite the name, this will round up
// This is because I do not care
// Example: findClosestNumber([8, 16, 32, 64, 128], 76) will return 128
export const findClosestNumber = (numbers: number[], target: number): number =>
  numbers.reduce((prev, curr) =>
    curr >= target && (prev < target || curr < prev) ? curr : prev,
  )

export const searchParam = (
  url: URL,
  key: string,
  value: string,
  ...deleteKeys: string[]
) => {
  url.searchParams.set(key, value)
  deleteKeys.forEach((k) => url.searchParams.delete(k))
  goto(url, {
    invalidateAll: true,
  })
}

// why is this using SvelteURL brother
export const fullCommunityName = (name: string, actorId: string) =>
  `${name}@${new SvelteURL(actorId).hostname}`

export const placeholders = {
  get: (type: 'url' | 'post' | 'body' | 'comment') => {
    switch (type) {
      case 'post':
        return Math.random() < 0.01 && env.PUBLIC_XYLIGHT_MODE
          ? 'top 10 reasons why TCP is brilliant and UDP is a spawn of satan'
          : t.get('placeholders.title')
      case 'body':
        return t.get('placeholders.body')
      case 'comment':
        return t.get('placeholders.comments')
      case 'url':
        return 'https://example.com'
    }
  },
}

// lol this function was made 3 years ago when lil xylight
// was still learning cs
export function moveItem<T>(
  array: T[],
  currentIndex: number,
  newIndex: number,
): T[] {
  if (
    currentIndex < 0 ||
    currentIndex >= array.length ||
    newIndex < 0 ||
    newIndex >= array.length
  ) {
    throw new Error('Invalid index')
  }

  const newArray = [...array]

  const [item] = newArray.splice(currentIndex, 1)
  newArray.splice(newIndex, 0, item)

  return newArray
}

export const DOMAIN_REGEX =
  /^(http(s)?:\/\/)?((?!-)[A-Za-z0-9-]{1,63}\.)+[A-Za-z]{2,63}(:[0-9]{0,5})?$/g
export const DOMAIN_REGEX_FORMS =
  '(http(s)?://)?((?!-)[A-Za-z0-9]{1,63}.)+[A-Za-z]{2,63}(:[0-9]{0,5})?'

export async function uploadImage(
  image: File | null | undefined,
  instance: string,
  jwt: string,
): Promise<string | undefined> {
  if (!image) return

  const formData = new FormData()
  formData.append('images[]', image)

  const res = await client({ auth: jwt, instanceURL: instance }).uploadImage({
    image: image,
  })

  if (res.url) return res.url
  else throw new Error(`Failed to upload image. ${res.msg}`)
}

export const instanceToURL = (input: string) =>
  input.startsWith('http://') || input.startsWith('https://')
    ? input
    : `https://${input}`

export function canParseUrl(url: string): boolean {
  try {
    new SvelteURL(url)
    return true
  } catch {
    return false
  }
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function fuzzySearch(text: string, pattern: string): number {
  const textLower = text.toLowerCase()
  const patternLower = pattern.toLowerCase()
  let score = 0
  let lastIndex = -1
  let consecutiveBonus = 0

  for (let i = 0; i < patternLower.length; i++) {
    const index = textLower.indexOf(patternLower[i], lastIndex + 1)
    if (index === -1) return 0

    score += 1
    if (index === lastIndex + 1) {
      consecutiveBonus++
      score += consecutiveBonus
    } else {
      consecutiveBonus = 0
    }

    lastIndex = index
  }

  if (textLower.startsWith(patternLower)) {
    score += 2
  } else if (textLower.includes(' ' + patternLower)) {
    score += 1
  }

  return score
}

export const awaitIfServer = async <T>(
  promise: Promise<T>,
): Promise<{
  data: Promise<T> | T
}> => ({ data: browser ? promise : await promise })

export class ReactiveState<T> {
  value = $state<T>()!

  constructor(initialValue: T) {
    this.value = initialValue as NonNullable<T>
  }
}

export function snapshot<T>(item: T) {
  return $state.snapshot(item)
}

// these methods should really not exist
// instead we should use lemmy's url_content_type which
// gives us a mimetype (which is more reliable)
export const isImage = (url: string | undefined) => {
  try {
    if (!url) return false

    return /\.(jpeg|jpg|gif|png|svg|bmp|webp|avif)/i.test(url)
  } catch {
    return false
  }
}

export const isVideo = (url: string | undefined) => {
  try {
    if (!url) return false

    return /\.(mp4|mov|webm|mkv|avi)/i.test(url)
  } catch {
    return false
  }
}

export const communityLink = (community: Community, prefix: string = '') =>
  `${prefix}/c/${fullCommunityName(community.name, community.actor_id)}`

export const userLink = (person: Person, prefix: string = '') =>
  `${prefix}/u/${person.name}@${new SvelteURL(person.actor_id).hostname}`

/**
 * Basic types only, don't use for anything more than basic equality
 */
export function recursiveEqual<T>(a: T, b: T): boolean {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object') return false

  if (a == null || b == null) {
    if (a == null && b == null) return true
    else return false
  }

  const keysA = Object.keys(a) as (keyof typeof a)[]
  const keysB = Object.keys(b) as (keyof typeof b)[]

  if (keysA.length != keysB.length) return false

  for (const key of keysA) {
    const valA = a[key]
    const valB = b[key]

    if (typeof valA == 'object' && typeof valB == 'object') {
      const result = recursiveEqual(valA!, valB!)
      if (!result) return false
    } else {
      if (valA != valB) return false
    }
  }

  return true
}
