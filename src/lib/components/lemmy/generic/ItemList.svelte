<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import { Button } from 'mono-svelte'
  import { flip } from 'svelte/animate'
  import { expoOut } from 'svelte/easing'

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

<CommonList animate={false} size="xs" {items}>
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
