import { client } from '$lib/api/client.svelte'
import { PiefedClient } from '$lib/api/piefed/adapter'
import type { Community, CommunityFlair, PostView } from '$lib/api/types'

export type PostFormInit = {
  community?: Community
  name?: string
  body?: string
  url?: string
  nsfw?: boolean
  alt_text?: string
  thumbnail?: string
  language_id?: number
  flair_list?: CommunityFlair[]
}

export class PostFormState {
  community?: Community
  title: string
  body?: string
  url?: string
  nsfw: boolean
  altText?: string
  thumbnail?: string
  language?: string
  flairList: CommunityFlair[]

  constructor(post?: PostFormInit) {
    this.community = $state(post?.community)
    this.title = $state(post?.name ?? '')
    this.body = $state(post?.body)
    this.url = $state(post?.url)
    this.nsfw = $state(post?.nsfw ?? false)
    this.altText = $state(post?.alt_text)
    this.language = $state(post?.language_id?.toString())
    this.flairList = $state(post?.flair_list ?? [])
  }

  validate(mode: 'edit' | 'create'): boolean {
    if (mode == 'create' && !this.community) return false
    if (this.url && !URL.canParse(this.url)) return false

    return true
  }

  async submit(postId?: number): Promise<PostView> {
    if (!this.validate(postId ? 'edit' : 'create'))
      throw new Error('failed validation')

    const api = client()

    let res: PostView
    if (postId) {
      res = (
        await api.editPost({
          post_id: postId,
          name: this.title,
          body: this.body,
          url: this.url,
          nsfw: this.nsfw,
          alt_text: this.altText,
          custom_thumbnail: this.thumbnail,
          language_id: Number(this.language) || undefined,
        })
      ).post_view
    } else {
      res = (
        await api.createPost({
          community_id: this.community!.id,
          name: this.title,
          body: this.body,
          url: this.url,
          alt_text: this.altText,
          custom_thumbnail: this.thumbnail,
          nsfw: this.nsfw,
          language_id: Number(this.language) || undefined,
        })
      ).post_view
    }

    if (api instanceof PiefedClient) {
      const flairRes = await api.assignFlair({
        flair_id_list: this.flairList.map((i) => i.id),
        post_id: res.post.id,
      })

      res.flair_list = flairRes.flair_list
    }

    return res
  }
}

export async function autofillPost(
  url: URL,
): Promise<{ title?: string; body?: string }> {
  const res = await client().getSiteMetadata({
    url: url.toString(),
  })

  return {
    title: res.metadata.title,
    body: res.metadata.description,
  }
}
