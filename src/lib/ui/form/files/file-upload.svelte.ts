import { client } from '$lib/api/client.svelte'

export const uploadStrategy = {
  default: (file: File) =>
    client().uploadImage({
      image: file,
    }),
  userAvatar: (file: File) =>
    client().uploadUserAvatar({
      image: file,
    }),
  userBanner: (file: File) =>
    client().uploadUserBanner({
      image: file,
    }),
  siteIcon: (file: File) =>
    client().uploadSiteIcon({
      image: file,
    }),
  siteBanner: (file: File) =>
    client().uploadSiteBanner({
      image: file,
    }),
}
