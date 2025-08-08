import { showImage } from '$lib/components/ui/ExpandableImage.svelte'
import { settings } from '$lib/settings.svelte'
import type { PostView } from 'lemmy-js-client'
import { isImage } from './image'

const binds = $derived(settings.keybinds)

export const keybindFeed = (
  selector: string = '[id^="item"]',
  block: 'center' | 'start' = 'center',
) => {
  return (event: KeyboardEvent) => {
    console.log(event)
    const direction =
      event.key == binds.lists.previous.key
        ? 'up'
        : event.key == binds.lists.next.key
          ? 'down'
          : null
    if (!direction) return

    const focusedPost =
      document.activeElement?.closest('[data-index]') ??
      document
        .elementFromPoint(window.innerWidth / 2, window.innerHeight / 2)
        ?.closest('[data-index]') ??
      document.querySelector('[data-index]')
    if (!focusedPost) return

    const sibling =
      direction == 'up'
        ? focusedPost.previousElementSibling
        : focusedPost.nextElementSibling
    if (sibling instanceof HTMLElement) {
      const postDiv = sibling.querySelector(selector)
      if (postDiv instanceof HTMLElement) {
        postDiv.scrollIntoView({ behavior: 'smooth', block: block })
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
    case binds.posts.upvote.key:
      castVote?.(post.my_vote == 1 ? 0 : 1)
      break
    case binds.posts.downvote.key:
      castVote?.(post.my_vote == -1 ? 0 : -1)
      break
    case binds.posts.expand.key:
      if (post.post.url && isImage(post.post.url)) showImage(post.post.url)
      break
  }
}
export const keybindComment = (
  e: KeyboardEvent,
  id: number,
  toggle: () => void,
) => {
  if ((e.target as HTMLDivElement).id == id.toString()) return

  const event = e as KeyboardEvent

  switch (event.key) {
    case binds.comments.collapse.key:
      toggle()
      break
  }
}
