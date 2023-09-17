export const isImage = (url: string | undefined) => {
  try {
    if (!url) return false

    return /\.(jpeg|jpg|gif|png|svg|bmp|webp)$/i.test(new URL(url).pathname)
  } catch (err) {
    return false
  }
}

export const isVideo = (url: string | undefined) => {
  try {
    if (!url) return false

    return /\.(mp4|mov|webm|mkv)$/i.test(new URL(url).pathname)
  } catch (err) {
    return false
  }
}
