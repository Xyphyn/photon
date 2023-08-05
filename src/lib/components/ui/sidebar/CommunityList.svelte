<script lang="ts">
  import Button from '$lib/components/input/Button.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import type { Community } from 'lemmy-js-client'

  export let items: Community[]
  export let expanded: boolean
</script>

{#each items.sort((a, b) => a.title.localeCompare(b.title)) as follow}
  <Button
    class="hover:bg-slate-200 {expanded ? '' : '!p-1.5'}"
    color="tertiary"
    alignment="left"
    href="/c/{follow.name}@{new URL(follow.actor_id).hostname}"
  >
    <div class="flex-none">
      <Avatar
        url={follow.icon}
        alt={follow.name}
        title={follow.title}
        width={20}
        slot="icon"
      />
    </div>
    <span class:hidden={!expanded}>
      {follow.title}
    </span>
  </Button>
{/each}
