<script lang="ts">
  import { Button, Material } from 'mono-svelte'
  import {
    ArrowUturnDown,
    Icon,
    QuestionMarkCircle,
    type IconSource,
  } from 'svelte-hero-icons'
  import Avatar from '../../Avatar.svelte'
  import type { Action } from './actions'

  export let action: Action
</script>

<Button
  href={action.href}
  on:click
  alignment="left"
  color="tertiary"
  size="lg"
  class="focus:bg-slate-200 focus:dark:bg-zinc-800 block w-full {$$props.class}"
  data-sveltekit-preload-code="viewport"
  data-sveltekit-preload-data="tap"
>
  {#if typeof action.icon === 'string'}
    <Avatar url={action.icon} width={20} />
  {:else}
    <Icon src={action.icon ?? QuestionMarkCircle} size="20" />
  {/if}
  <slot />
  <span class="mr-auto">{action.name}</span>
  {#if action.shortcut}
    <div class="flex items-center gap-0.5 text-xs font-medium">
      ⌘ {action.shortcut}
    </div>
  {/if}
  {#if action.subActions}
    <Icon src={ArrowUturnDown} size="16" micro />
  {/if}
</Button>
