<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import type { Community } from 'lemmy-js-client'
  import { Button } from 'mono-svelte'
  import { flip } from 'svelte/animate'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  export let items: Community[]
</script>

{#each items.sort( (a, b) => a.title.localeCompare(b.title) ) as follow (follow.id)}
  <div
    class="inline-flex w-full"
    animate:flip={{ duration: 500, easing: expoOut }}
  >
    <SidebarButton
      class="font-normal w-full h-max"
      color="tertiary"
      alignment="left"
      href="/c/{follow.name}@{new URL(follow.actor_id).hostname}"
    >
      <div class="flex-none">
        <Avatar
          url={follow.icon}
          alt={follow.name}
          title={follow.title}
          width={24}
          slot="prefix"
        />
      </div>
      <div class="flex flex-col max-w-full break-words" slot="label">
        <span>{follow.title}</span>
        <span class="text-xs text-slate-600 dark:text-zinc-400">
          {new URL(follow.actor_id).hostname}
        </span>
      </div>
    </SidebarButton>
  </div>
{/each}
