<script lang="ts">
  import type { PostView } from 'lemmy-js-client'
  import Post from './Post.svelte'

  interface Props {
    post: PostView
  }

  let { post }: Props = $props()
</script>

<Post {post} class="py-0!" />
