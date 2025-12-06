<script lang="ts">
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { userLink } from '$lib/app/util.svelte.js'
  import ItemList from '$lib/ui/generic/ItemList.svelte'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Button } from 'mono-svelte'
  import { ArrowUturnUp, Check, Trash } from 'svelte-hero-icons/dist'

  let { data } = $props()

  async function unblock(id: number) {
    if (!data.person_blocks) return
    data.person_blocks.splice(
      data.person_blocks.findIndex((i) => i.person.id == id),
      1,
    )

    await profile.client.blockPerson({
      block: false,
      person_id: id,
    })
  }
</script>

{#if data.person_blocks && data.person_blocks?.length > 0}
  <ItemList
    items={data.person_blocks.map((i) => ({
      id: i.target.id,
      name: i.target.name,
      avatar: i.target.avatar,
      url: userLink(i.target),
      instance: new URL(i.target.actor_id).hostname,
      circle: true,
    }))}
    link={false}
  >
    {#snippet action(block)}
      <Button
        title={$t('common.jump')}
        size="square-md"
        href={block.url}
        color="primary"
        icon={ArrowUturnUp}
      />
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
    title={$t('routes.profile.blocks.empty.user.title')}
    description={$t('routes.profile.blocks.empty.user.description')}
    icon={Check}
    class="my-auto"
  />
{/if}
