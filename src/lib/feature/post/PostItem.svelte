<script lang="ts">
  import type { PostView } from '$lib/api/types'
  import { Post } from '.'

  interface Props {
    post: PostView
  }

  let { post }: Props = $props()
</script>

<Post {post} />
