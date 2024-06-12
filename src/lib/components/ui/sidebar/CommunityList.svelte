<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import SidebarButton from '$lib/components/ui/sidebar/SidebarButton.svelte'
  import { communityLink } from '$lib/lemmy/generic'
  import { addResumable } from '$lib/lemmy/item'
  import type { Community } from 'lemmy-js-client'
  import { Button } from 'mono-svelte'
  import { Icon, Star } from 'svelte-hero-icons'
  import { flip } from 'svelte/animate'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  export let items: Community[]
</script>

{#each items.sort( (a, b) => a.title.localeCompare(b.title) ) as follow (follow.id)}
  <div
    class="inline-flex w-full items-center px-3"
    animate:flip={{ duration: 500, easing: expoOut }}
  >
    <div class="flex-none grid group">
      <Button
        rounding="pill"
        size="custom"
        class="hidden group-hover:inline-flex opacity-0 group-hover:opacity-100 transition-all z-20
      items-center justify-center box-border w-7 h-7"
        style="grid-column: 1; grid-row: 1;"
        on:click={() =>
          addResumable({
            id: follow.id,
            name: follow.title,
            type: 'community',
            url: communityLink(follow),
            avatar: follow.icon,
          })}
      >
        <Icon src={Star} size="16" mini />
      </Button>
      <Avatar
        url={follow.icon}
        alt={follow.name}
        title={follow.title}
        width={28}
        class="group-hover:hidden"
      />
    </div>
    <SidebarButton
      class="font-normal w-full h-max !px-1"
      color="tertiary"
      alignment="left"
      href="/c/{follow.name}@{new URL(follow.actor_id).hostname}"
    >
      <div class="flex flex-col max-w-full break-words" slot="label">
        <span>{follow.title}</span>
        <span class="text-xs text-slate-600 dark:text-zinc-400">
          {new URL(follow.actor_id).hostname}
        </span>
      </div>
    </SidebarButton>
  </div>
{/each}
