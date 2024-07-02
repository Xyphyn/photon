const FEATURES = {
  moderatorView: '0.19.0',
  controversialSort: '0.19.0',
  scaledSort: '0.19.0',
  unproxiedImageUpload: '0.19.0',
  cursorPagination: '0.19.0',
  newTotp: '0.19.0',
  blockInstances: '0.19.0',
  hidePosts: '0.19.4',
  altText: '0.19.4',
  customThumbnail: '0.19.4',
}

type Feature = keyof typeof FEATURES

/**
 * Check if a feature is supported by the current version.
 */
export const feature = (feature: Feature, version: string = '0.0.0'): boolean =>
  versionIsSupported(version, FEATURES[feature])

export const MINIMUM_VERSION = '0.19.0'
export const MAXIMUM_VERSION = '0.999'

export const versionIsSupported = (v: string, minimum: string) => {
  const regex = /^(\d+\.)?(\d+\.)?(\*|\d+)*/i
  const cur = v.match(regex)
  const min = minimum.match(regex)

  if (!cur || !min) return false

  const [minMajor, minMinor, minPatch] = min.slice(1, 4).map((i) => Number(i))
  const [curMajor, curMinor, curPatch] = cur.slice(1, 4).map((i) => Number(i))

  if (curMajor < minMajor) return false
  else if (curMajor > minMajor) return true

  if (curMinor < minMinor) return false
  else if (curMinor > minMinor) return true

  if (curPatch < minPatch) return false

  return true
}
