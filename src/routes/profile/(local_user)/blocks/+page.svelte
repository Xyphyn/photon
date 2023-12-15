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
      <SectionTitle>Instances</SectionTitle>
      <EditableList let:action on:action={(i) => unblockInstances(i.detail)}>
        {#each data.my_user?.instance_blocks as block (block.instance.id)}
          <div
            class="flex flex-row gap-2 items-center py-4 justify-between"
            animate:flip={{ duration: 250 }}
            out:slide|local={{ axis: 'y' }}
          >
            <Entity
              icon={block.site?.icon}
              name={block.site?.name ?? block.instance.domain}
              label={block.instance.domain}
            />
            <Button
              title="Unblock"
              size="square-md"
              on:click={() => action(block)}
            >
              <Icon src={XMark} mini size="16" slot="prefix" />
            </Button>
          </div>
        {/each}
      </EditableList>
    </div>
  {:else}
    <Placeholder
      description="Go to a community's page and click 'block instance' to stop seeing posts and
    comments from its instance."
      title="No blocked instances"
      center={false}
    />
  {/if}
  {#if data.community_blocks?.length > 0}
    <div>
      <SectionTitle>Communities</SectionTitle>
      <EditableList let:action on:action={(i) => unblockCommunity(i.detail)}>
        {#each data.community_blocks as block (block.community.id)}
          <div
            class="flex flex-row gap-2 items-center py-2 justify-between"
            animate:flip={{ duration: 250 }}
            out:slide|local={{ axis: 'y' }}
          >
            <CommunityLink community={block.community} avatar />
            <Button
              title="Unblock"
              size="square-md"
              on:click={() => action(block)}
            >
              <Icon src={XMark} mini size="16" slot="prefix" />
            </Button>
          </div>
        {/each}
      </EditableList>
    </div>
  {:else}
    <Placeholder
      description="Go to a community's page and click 'block' to stop seeing posts and
  comments from it."
      title="No blocked communities"
      center={false}
    />
  {/if}
  {#if data.person_blocks?.length > 0}
    <div>
      <SectionTitle>Users</SectionTitle>
      <EditableList let:action on:action={(i) => unblockUser(i.detail)}>
        {#each data.person_blocks as block (block.target.id)}
          <div
            class="flex flex-row gap-2 items-center py-2 justify-between"
            animate:flip={{ duration: 250 }}
            out:slide|local={{ axis: 'y' }}
          >
            <UserLink user={block.target} avatar badges />
            <Button
              title="Unblock"
              size="square-md"
              on:click={() => action(block)}
            >
              <Icon src={XMark} mini size="16" slot="prefix" />
            </Button>
          </div>
        {/each}
      </EditableList>
    </div>
  {:else}
    <Placeholder
      description="Go to a user's profile and click 'block' to stop seeing posts and
    comments from them."
      title="No blocked users"
      center={false}
    />
  {/if}
{:else}
  <div class="my-auto">
    <Placeholder
      description="Go to a community or user's page and click 'block' to stop seeing submissions from it."
      title="No blocks"
      center={false}
    />
  </div>
{/if}
