import type { PostView } from '$lib/api/types'

export const parseKeywordFilter = (value?: string | null): string[] => {
  if (!value) return []

  return value
    .split(/[\n,]+/g)
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean)
}

const removeSchemeFromUrl = (value: string): string => {
  const trimmed = value.trim().toLowerCase()
  const schemeIndex = trimmed.indexOf('://')
  if (schemeIndex === -1) return trimmed
  return trimmed.slice(schemeIndex + 1)
}

export const parseUrlFilter = (value?: string | null): string[] =>
  parseKeywordFilter(value).map((entry) => removeSchemeFromUrl(entry))

export const shouldFilterPost = (
  post: PostView,
  keywords: string[],
): boolean => {
  if (keywords.length === 0) return false

  const haystack = [post.post.name, post.post.body ?? '']
    .join(' ')
    .toLowerCase()

  return keywords.some((keyword) => haystack.includes(keyword))
}

export const shouldFilterPostByUrl = (
  post: PostView,
  urlFilters: string[],
): boolean => {
  if (urlFilters.length === 0) return false
  if (!post.post.url) return false

  const postUrl = removeSchemeFromUrl(post.post.url)

  return urlFilters.some((filterUrl) => postUrl.startsWith(filterUrl))
}
