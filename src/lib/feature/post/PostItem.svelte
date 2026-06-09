<script lang="ts">
  import type { View } from '$lib/app/settings.svelte'
  import type { ClassValue } from 'svelte/elements'
  import { Post } from '.'
  import type { PostModel } from './post.svelte'

  interface Props {
    post: PostModel
    view?: View
    class?: ClassValue
  }

  let { post, ...rest }: Props = $props()
</script>

<Post {...rest} {post} />
