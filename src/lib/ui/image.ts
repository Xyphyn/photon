export const isImage = (url: string | undefined) => {
  if (!url) return false

  return /\.(jpeg|jpg|gif|png|svg|bmp|webp)$/i.test(new URL(url).pathname)
}

export const isVideo = (inputUrl: string | undefined) => {
  if (!inputUrl) return false

  const url = new URL(inputUrl).pathname.toLowerCase()

  return url.endsWith('mp4') || url.endsWith('webm') || url.endsWith('mov') || url.endsWith('m4v')
}

export const isYouTube = (url: string | undefined) => {
    if (!url) return false
    return url.includes('youtube.com') || url.includes('youtu.be')
}

// Returns a string representing the detected post type
// image | video | youtube | link | thumbLink | text
export const postType = (post: object | undefined) => {
    if (!post) return false
    
    if (isImage(post.post.url)) {
        return "image"
    }

    if (isVideo(post.post.url)) {
        return "video"
    }

    if (isYouTube(post.post.url)) {
        return "youtube"
    }
    
    if (
        post.post.url && !post.post.thumbnail_url) {
        return "link"
    }

    if (
        post.post.thumbnail_url && post.post.url) {
        return "thumbLink"
    }

    // If no other type matches, render as a plain text
    return "text"
}