<script lang="ts">
  import { Post } from '.'
  import type { PostModel } from './post.svelte'

  interface Props {
    post: PostModel
  }

  let { post }: Props = $props()
</script>

<Post {post} />
