<script lang="ts">
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import CommonList from '$comp/ui/layout/CommonList.svelte'
  import { Button } from 'mono-svelte'

  interface Props {
    items: {
      avatar?: string
      name: string
      instance?: string
      id: number
      url: string
    }[]
  }

  let { items }: Props = $props()
</script>

<CommonList animate={false} class="px-1 py-0.5" size="xs" {items}>
  {#snippet item(item)}
    <Button
      class="font-normal w-full h-max block"
      color="none"
      alignment="left"
      href={item.url}
    >
      <div class="flex-none">
        <Avatar
          url={item.avatar}
          alt={item.name}
          title={item.name}
          width={24}
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
    </Button>
  {/snippet}
</CommonList>
