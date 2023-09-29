export const MINIMUM_VERSION = '0.18.1'
export const MAXIMUM_VERSION = '0.999'

export const versionIsSupported = (v: string, minimum: string) => {
  const regex = /^(\d+\.)?(\d+\.)?(\*|\d+)*/i
  const cur = v.match(regex)
  const min = minimum.match(regex)

  if (!cur || !min) return false

  const [minMajor, minMinor, minPatch] = min.slice(1, 4).map((i) => Number(i))
  const [curMajor, curMinor, curPatch] = cur.slice(1, 4).map((i) => Number(i))

  if (curMajor < minMajor) {
    return false
  } else if (curMajor > minMajor) {
    return true
  }

  if (curMinor < minMinor) {
    return false
  } else if (curMinor > minMinor) {
    return true
  }

  if (curPatch < minPatch) {
    return false
  }

  return true
}
