import { settings } from '$lib/settings.svelte'
import type { PostView } from 'lemmy-js-client'
import { isImage } from './image'
import { showImage } from '$lib/components/ui/ExpandableImage.svelte'

const binds = $derived(settings.keybinds)

export const keybindFeed = () => {
  return (event: KeyboardEvent) => {
    console.log(event)
    const direction =
      event.key == binds.post.previous.key
        ? 'up'
        : event.key == binds.post.next.key
          ? 'down'
          : null
    if (!direction) return

    const focusedPost =
      document.activeElement?.closest('[data-index]') ??
      document
        .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        ?.closest('[data-index]')
    if (!focusedPost) return

    const sibling =
      direction == 'up'
        ? focusedPost.previousSibling
        : focusedPost.nextElementSibling
    if (sibling instanceof HTMLElement) {
      const postDiv = sibling.querySelector('[id^="post"]')
      if (postDiv instanceof HTMLElement) {
        postDiv.scrollIntoView({ behavior: 'smooth', block: 'center' })
        postDiv.focus({})
      }
    }
  }
}

export const keybindPost = (
  e: KeyboardEvent,
  post: PostView,
  castVote?: (vote: number) => void,
) => {
  if ((e.target as HTMLDivElement).id.split('-')[1] != post.post.id.toString())
    return

  const event = e as KeyboardEvent

  switch (event.key) {
    case binds.post.upvote.key:
      castVote?.(post.my_vote == 1 ? 0 : 1)
      break
    case binds.post.downvote.key:
      castVote?.(post.my_vote == -1 ? 0 : -1)
      break
    case binds.post.expand.key:
      if (post.post.url && isImage(post.post.url)) showImage(post.post.url)
      break
  }
}
