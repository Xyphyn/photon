<script lang="ts">
  import type {
    CommunityBlockView,
    InstanceBlockView,
    PersonBlockView,
  } from 'lemmy-js-client'
  import type { PageData } from './$types.js'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { profile } from '$lib/auth.js'
  import { Check, Icon, Trash, XMark } from 'svelte-hero-icons'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import { flip } from 'svelte/animate'
  import { slide } from 'svelte/transition'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { Button } from 'mono-svelte'
  import Entity from '$lib/components/ui/Entity.svelte'
  import { t } from '$lib/translations.js'
  import Switch from '$lib/components/input/Switch.svelte'
  import UserAutocomplete from '$lib/components/lemmy/user/UserAutocomplete.svelte'
  import { expoOut } from 'svelte/easing'

  // sveltekit doesn't feel like making types work right now
  export let data: PageData & {
    person_blocks: PersonBlockView[]
    community_blocks: CommunityBlockView[]
  }

  async function unblockUser(item: PersonBlockView) {
    if (!$profile?.jwt) return

    data.person_blocks.splice(
      data.person_blocks.findIndex((i) => i.target.id == item.target.id),
      1
    )
    // hack to get reactivity working
    data.person_blocks = data.person_blocks

    await getClient().blockPerson({
      block: false,
      person_id: item.target.id,
    })
  }

  async function unblockCommunity(item: CommunityBlockView) {
    if (!$profile?.jwt) return

    data.community_blocks.splice(
      data.community_blocks.findIndex(
        (i) => i.community.id == item.community.id
      ),
      1
    )

    // hack to get reactivity working
    data.community_blocks = data.community_blocks

    await getClient().blockCommunity({
      block: false,
      community_id: item.community.id,
    })
  }

  async function unblockInstances(item: InstanceBlockView) {
    if (!$profile?.jwt) return
    if (!data.my_user?.instance_blocks) return

    data.my_user.instance_blocks.splice(
      data.my_user.instance_blocks.findIndex(
        (i) => i.instance.id == item.instance.id
      ),
      1
    )
    data.my_user.instance_blocks = data.my_user.instance_blocks

    await getClient().blockInstance({
      block: false,
      instance_id: item.instance.id,
    })
  }
</script>

{#if data.community_blocks?.length > 0 || data.person_blocks?.length > 0 || (data.my_user?.instance_blocks?.length ?? 0) > 0}
  {#if data.my_user?.instance_blocks && (data.my_user?.instance_blocks?.length ?? 0) > 0}
    <div>
      <SectionTitle>{$t('content.instances')}</SectionTitle>
      <EditableList let:action on:action={(i) => unblockInstances(i.detail)}>
        {#each data.my_user?.instance_blocks as block (block.instance.id)}
          <div
            class="flex flex-row gap-2 items-center py-4"
            animate:flip={{ duration: 250 }}
            out:slide|local={{ axis: 'y' }}
          >
            <Button
              title="Unblock"
              size="square-md"
              rounding="pill"
              on:click={() => action(block)}
            >
              <Icon src={XMark} mini size="16" slot="prefix" />
            </Button>
            <Entity
              icon={block.site?.icon}
              name={block.site?.name ?? block.instance.domain}
              label={block.instance.domain}
            />
          </div>
        {/each}
      </EditableList>
    </div>
  {/if}
  {#if data.community_blocks?.length > 0}
    <div>
      <SectionTitle>{$t('content.communities')}</SectionTitle>
      <EditableList let:action on:action={(i) => unblockCommunity(i.detail)}>
        {#each data.community_blocks as block (block.community.id)}
          <div
            class="flex flex-row gap-2 items-center py-2"
            animate:flip={{ duration: 250 }}
            out:slide|global={{ axis: 'y', easing: expoOut, duration: 300 }}
          >
            <Button
              title="Unblock"
              size="square-md"
              rounding="pill"
              on:click={() => action(block)}
            >
              <Icon src={XMark} mini size="16" slot="prefix" />
            </Button>
            <CommunityLink community={block.community} avatar />
          </div>
        {/each}
      </EditableList>
    </div>
  {/if}
  {#if data.person_blocks?.length > 0}
    <div>
      <SectionTitle>{$t('content.users')}</SectionTitle>
      <EditableList let:action on:action={(i) => unblockUser(i.detail)}>
        {#each data.person_blocks as block (block.target.id)}
          <div
            class="flex flex-row gap-2 items-center py-2"
            animate:flip={{ duration: 250 }}
            out:slide|global={{ axis: 'y', easing: expoOut, duration: 300 }}
          >
            <Button
              title="Unblock"
              size="square-md"
              rounding="pill"
              on:click={() => action(block)}
            >
              <Icon src={XMark} mini size="16" slot="prefix" />
            </Button>
            <UserLink user={block.target} avatar badges />
          </div>
        {/each}
      </EditableList>
    </div>
  {/if}
{:else}
  <div class="h-full w-full grid place-items-center">
    <Placeholder
      icon={Check}
      title={$t('routes.profile.blocks.empty.title')}
      description={$t('routes.profile.blocks.empty.description')}
    />
  </div>
{/if}
