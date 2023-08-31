<script lang="ts">
  import type { CommunityBlockView, PersonBlockView } from 'lemmy-js-client'
  import type { PageData } from './$types.js'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import { Check, Icon, Trash } from 'svelte-hero-icons'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import { flip } from 'svelte/animate'
  import { slide } from 'svelte/transition'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { _ } from 'svelte-i18n'

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
      auth: $profile.jwt,
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
      auth: $profile.jwt,
      block: false,
      community_id: item.community.id,
    })
  }
</script>

<svelte:head>
  <title>{$_('page.profile.blocks')}</title>
</svelte:head>

{#if data.community_blocks.length > 0 || data.person_blocks.length > 0}
  {#if data.person_blocks.length > 0}
    <div>
      <SectionTitle>Users</SectionTitle>
      <EditableList let:action on:action={(i) => unblockUser(i.detail)}>
        {#each data.person_blocks as block (block.target.id)}
          <div
            class="flex flex-row gap-4 items-center py-4 justify-between"
            animate:flip={{ duration: 250 }}
            out:slide|local={{ axis: 'y' }}
          >
            <UserLink user={block.target} avatar badges />
            <Button size="square-md" on:click={() => action(block)}>
              <Icon src={Trash} mini size="16" slot="icon" />
            </Button>
          </div>
        {/each}
      </EditableList>
    </div>
  {:else}
    <Placeholder
      description="Go to a user's profile and click 'block' to stop seeing posts and
    comments from them."
      title="No user blocks"
      icon={Check}
    />
  {/if}

  {#if data.community_blocks.length > 0}
    <div>
      <SectionTitle>Communities</SectionTitle>
      <EditableList let:action on:action={(i) => unblockCommunity(i.detail)}>
        {#each data.community_blocks as block (block.community.id)}
          <div
            class="flex flex-row gap-4 items-center py-4 justify-between"
            animate:flip={{ duration: 250 }}
            out:slide|local={{ axis: 'y' }}
          >
            <CommunityLink community={block.community} avatar />
            <Button size="square-md" on:click={() => action(block)}>
              <Icon src={Trash} mini size="16" slot="icon" />
            </Button>
          </div>
        {/each}
      </EditableList>
    </div>
  {:else}
    <Placeholder
      description="Go to a community's page and click 'block' to stop seeing posts and
comments from it."
      title="No community blocks"
      icon={Check}
    />
  {/if}
{:else}
  <div class="my-auto">
    <Placeholder
      description="Go to a community or user's page to stop seeing submissions from it."
      title="No blocks"
      icon={Check}
    />
  </div>
{/if}
