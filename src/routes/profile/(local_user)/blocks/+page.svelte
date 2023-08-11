<script lang="ts">
  import type { CommunityBlockView, PersonBlockView } from 'lemmy-js-client'
  import type { PageData } from './$types.js'
  import EditableList from '$lib/components/ui/list/EditableList.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import { getClient } from '$lib/lemmy.js'
  import { profile } from '$lib/auth.js'
  import Button from '$lib/components/input/Button.svelte'
  import { Icon, Trash } from 'svelte-hero-icons'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'

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

<div>
  <SectionTitle>Users</SectionTitle>
  <EditableList let:action on:action={(i) => unblockUser(i.detail)}>
    {#each data.person_blocks as block}
      <div class="flex flex-row gap-4 items-center py-4 justify-between">
        <UserLink user={block.target} avatar badges />
        <Button size="square-md" on:click={() => action(block.target)}>
          <Icon src={Trash} mini size="16" slot="icon" />
        </Button>
      </div>
    {/each}
  </EditableList>
</div>

<div>
  <SectionTitle>Communities</SectionTitle>
  <EditableList let:action on:action={(i) => unblockCommunity(i.detail)}>
    {#each data.community_blocks as block}
      <div class="flex flex-row gap-4 items-center py-4 justify-between">
        <CommunityLink community={block.community} avatar />
        <Button size="square-md" on:click={() => action(block.community)}>
          <Icon src={Trash} mini size="16" slot="icon" />
        </Button>
      </div>
    {/each}
  </EditableList>
</div>
