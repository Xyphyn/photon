export const isImage = (url: string | undefined) => {
  if (!url) return false

  return /\.(jpeg|jpg|gif|png|svg|bmp|webp)$/i.test(new URL(url).pathname)
}

export const isVideo = (url: string | undefined) => {
  if (!url) return false

  return new URL(url).pathname.toLowerCase().endsWith('.mp4')
}
