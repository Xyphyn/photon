<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/Button.svelte'
  import Link from '$lib/components/Link.svelte'
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import Post from './post/[id]/Post.svelte'

  export let data
</script>

<div class="flex flex-row max-w-full">
  <div class="flex flex-col gap-2">
    <MultiSelect options={['Subscribed', 'Local', 'All']} selected="Local" />

    <div class="flex flex-col gap-4">
      {#each data.posts as post}
        <Post {post} />
      {/each}
    </div>

    <div>
      <Button
        on:click={() =>
          goto(
            `/?page=${(Number($page.url.searchParams.get('page')) || 1) + 1}`
          )}
      >
        Next
      </Button>
    </div>
  </div>
</div>
