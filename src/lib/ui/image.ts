export const isImage = (url: string | undefined) => {
  if (!url) return false

  return /\.(jpeg|jpg|gif|png|svg|bmp|webp)$/i.test(new URL(url).pathname)
}

export const isVideo = (inputUrl: string | undefined) => {
  if (!inputUrl) return false

  const url = new URL(inputUrl).pathname.toLowerCase()

  return url.endsWith('mp4') || url.endsWith('webm') || url.endsWith('mov') || url.endsWith('m4v')
}
