<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Button } from 'mono-svelte'
  import { Check, Trash } from 'svelte-hero-icons/dist'

  let { data } = $props()

  async function unblock(id: number) {
    if (!data.instance_communities_blocks) return
    data.instance_communities_blocks.splice(
      data.instance_communities_blocks.findIndex((i) => i.id == id),
      1,
    )

    await profile.client.userBlockInstanceCommunities({
      block: false,
      instance_id: id,
    })
  }
</script>

{#if data.instance_communities_blocks && data.instance_communities_blocks?.length > 0}
  <ItemList
    items={data.instance_communities_blocks.map((i) => ({
      id: i.id,
      name: i.domain,
      instance: i.domain,
    }))}
    link={false}
  >
    {#snippet action(block)}
      <Button title="Unblock" size="square-md" onclick={() => unblock(block.id)} icon={Trash} />
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
