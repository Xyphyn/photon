export const isImage = (url: string | undefined) =>
  /\.(jpeg|jpg|gif|png|svg|bmp|webp)$/i.test(url ?? '')
