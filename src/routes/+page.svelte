<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import Button from '$lib/components/Button.svelte'
  import Link from '$lib/components/Link.svelte'
  import MultiSelect from '$lib/components/MultiSelect.svelte'
  import Post from './post/[id]/Post.svelte'

  export let data
</script>

<div class="flex flex-col gap-2">
  <div class="flex flex-col sm:flex-row gap-4">
    <MultiSelect
      options={['Subscribed', 'Local', 'All']}
      selected={$page.url.searchParams.get('type') ?? 'Local'}
      on:select={(e) => {
        const url = $page.url
        url.searchParams.set('type', e.detail)
        url.searchParams.delete('page')
        goto(url, {
          invalidateAll: true,
        })
      }}
    />
    <MultiSelect
      options={['Active', 'TopDay', 'New']}
      optionNames={['Active', 'Top (Day)', 'New']}
      selected={$page.url.searchParams.get('sort') ?? 'Active'}
      on:select={(e) => {
        const url = $page.url
        url.searchParams.set('sort', e.detail)
        url.searchParams.delete('page')
        goto(url, {
          invalidateAll: true,
        })
      }}
    />
  </div>

  <div class="flex flex-col gap-4 w-full">
    {#each data.posts as post}
      <Post {post} />
    {/each}
  </div>

  <div>
    <Link
      href={(function () {
        $page.url.searchParams.set(
          'page',
          ((Number($page.url.searchParams.get('page')) || 1) + 1).toString()
        )

        return $page.url.toString()
      })()}
    >
      Next
    </Link>
  </div>
</div>
