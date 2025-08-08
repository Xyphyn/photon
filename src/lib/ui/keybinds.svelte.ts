import { settings } from '$lib/settings.svelte'
import type { PostView } from 'lemmy-js-client'
import type { Attachment } from 'svelte/attachments'
import { isImage } from './image'
import { showImage } from '$lib/components/ui/ExpandableImage.svelte'

const binds = $derived(settings.keybinds)

export const keybindFeed = (): Attachment => {
  return () => {
    window.addEventListener('keydown', event => {
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
    })
  }
}

export const keybindPost = (
  post: PostView,
  castVote?: (vote: number) => void,
): Attachment => {
  return (element: Element) => {
    if (element! instanceof HTMLButtonElement) return
    element.addEventListener('keydown', e => {
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
      }
    })
  }
}
