<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Button } from 'mono-svelte'
  import { Check, Trash } from 'svelte-hero-icons/dist'

  let { data } = $props()

  async function unblock(id: number) {
    if (!data.my_user?.instance_blocks) return
    data.my_user?.instance_blocks.splice(
      data.my_user?.instance_blocks.findIndex((i) => i.instance.id == id),
      1,
    )

    await profile.client.blockInstance({
      block: false,
      instance_id: id,
    })
  }
</script>

{#if data.my_user?.instance_blocks && data.my_user?.instance_blocks?.length > 0}
  <ItemList
    items={data.my_user?.instance_blocks.map((i) => ({
      id: i.instance.id,
      name: i.site?.name ?? i.instance.domain,
      avatar: i.site?.icon,
      instance: i.instance.domain,
    }))}
    link={false}
  >
    {#snippet action(block)}
      <Button
        title="Unblock"
        size="square-md"
        onclick={() => unblock(block.id)}
        icon={Trash}
      />
    {/snippet}
  </ItemList>
{:else}
  <Placeholder
    title={$t('routes.profile.blocks.empty.instance.title')}
    description={$t('routes.profile.blocks.empty.instance.description')}
    icon={Check}
    class="my-auto"
  />
{/if}
