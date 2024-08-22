<script lang="ts">
  import Markdown from '$lib/components/markdown/Markdown.svelte'
  import { client } from '$lib/lemmy'
  import { t } from '$lib/translations'
  import type { PrivateMessageView } from 'lemmy-js-client'
  import { Button, Menu, MenuButton, MenuDivider, Popover } from 'mono-svelte'
  import { createEventDispatcher } from 'svelte'
  import { EllipsisVertical, Flag, Icon, Trash } from 'svelte-hero-icons'

  export let message: PrivateMessageView
  export let primary: boolean = false

  const dispatch = createEventDispatcher<{ delete: boolean; report: boolean }>()
</script>

<div
  class="group relative w-full flex gap-1 items-center {primary
    ? 'flex-row-reverse'
    : 'flex-row'}"
  style="max-width: min(70vw,24rem)"
>
  <div
    class="{primary
      ? 'bg-primary-900 dark:bg-primary-100 text-slate-50 dark:text-zinc-900 hover:brightness-75'
      : 'bg-slate-100 dark:bg-zinc-900 hover:brightness-125'} rounded-2xl w-max p-1.5 px-3
    font-medium cursor-pointer transition-all"
  >
    <Markdown source={message.private_message.content} inline />
  </div>
  <Menu>
    <Button
      color="tertiary"
      class="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all flex-shrink-0"
      size="square-md"
      rounding="pill"
      slot="target"
      title={$t('post.actions.more.actions')}
    >
      <Icon src={EllipsisVertical} size="16" micro />
    </Button>
    <MenuDivider>{$t('post.actions.more.actions')}</MenuDivider>
    {#if primary}
      <MenuButton
        color="danger-subtle"
        on:click={() => dispatch('delete', true)}
      >
        <Icon src={Trash} size="16" micro slot="prefix" />
        {$t('post.actions.more.delete')}
      </MenuButton>
    {:else}
      <MenuButton
        color="danger-subtle"
        on:click={() => dispatch('report', true)}
      >
        <Icon src={Flag} size="16" micro slot="prefix" />
        {$t('moderation.report')}
      </MenuButton>
    {/if}
  </Menu>
</div>
