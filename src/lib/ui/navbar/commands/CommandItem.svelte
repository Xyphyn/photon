<script lang="ts">
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { Button } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import {
    ArrowUturnDown,
    Icon,
    QuestionMarkCircle,
  } from 'svelte-hero-icons/dist'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Action } from './actions.svelte'

  interface Props {
    action: Action
    class?: string
    children?: Snippet
    onclick?: HTMLButtonAttributes['onclick']
  }

  let { action, children, ...rest }: Props = $props()
</script>

<Button
  href={action.href}
  alignment="left"
  color="none"
  size="custom"
  class="block w-full"
  data-sveltekit-preload-code="viewport"
  data-sveltekit-preload-data="tap"
  {...rest}
>
  {#if typeof action.icon === 'string'}
    <Avatar url={action.icon} width={20} />
  {:else}
    <Icon
      src={action.icon ?? QuestionMarkCircle}
      solid
      size="20"
      class="text-slate-600 dark:text-zinc-400"
    />
  {/if}
  {@render children?.()}
  <div class="inline-flex flex-col">
    <span>{action.name}</span>
    {#if action.detail}
      <span class="font-normal text-xs">{action.detail}</span>
    {/if}
  </div>
  <div class="flex-1"></div>
  {#if action.shortcut}
    <div class="flex items-center gap-0.5 text-xs font-medium">
      ⌘ {action.shortcut}
    </div>
  {/if}
  {#if action.subActions}
    <Icon src={ArrowUturnDown} size="16" micro class="" />
  {/if}
</Button>
