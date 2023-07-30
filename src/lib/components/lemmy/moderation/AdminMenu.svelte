<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Menu from '$lib/components/ui/menu/Menu.svelte'
  import type { CommentView, PostView } from 'lemmy-js-client'
  import { CommandLine, Icon } from 'svelte-hero-icons'

  let acting = false

  export let item: PostView | CommentView
</script>

<Menu let:toggleOpen alignment="bottom-right">
  <Button
    class="!p-1.5 hover:text-red-500 dark:text-zinc-400 text-slate-500"
    on:click={toggleOpen}
    slot="button"
    size="sm"
    loading={acting}
    {...$$restProps}
  >
    <Icon src={CommandLine} mini size="16" />
  </Button>

  <span class="px-4 py-1 my-1 text-xs text-slate-600 dark:text-zinc-400">
    Administration
  </span>
</Menu>
