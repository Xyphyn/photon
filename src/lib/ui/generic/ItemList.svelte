<script lang="ts">
  import { Button } from 'mono-svelte'
  import type { Snippet } from 'svelte'
  import { CommonList } from '../layout'
  import Avatar from './Avatar.svelte'

  type Item = {
    avatar?: string
    name: string
    instance?: string
    id: number
    url?: string
    circle?: boolean
  }

  interface Props {
    items: Item[]
    link?: boolean
    action?: Snippet<[Item]>
  }

  let { items, link, action }: Props = $props()
</script>

<CommonList animate={false} class="px-1 py-0.5" size="xs" {items}>
  {#snippet item(item)}
    <Button
      class="font-normal w-full h-max block gap-2"
      gap="lg"
      color="none"
      alignment="left"
      href={link ? item.url : undefined}
    >
      <div class="flex-none">
        <Avatar
          url={item.avatar}
          alt={item.name}
          title={item.name}
          width={24}
          circle={item.circle ?? false}
        />
      </div>
      <div class="flex flex-col max-w-full break-words">
        <span>{item.name}</span>
        {#if item.instance}
          <span class="text-xs text-slate-600 dark:text-zinc-400">
            {item.instance}
          </span>
        {/if}
      </div>
      {#if action}
        <div class="flex-1"></div>
        {@render action(item)}
      {/if}
    </Button>
  {/snippet}
</CommonList>
