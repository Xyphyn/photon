<script lang="ts">
  import { profile } from '$lib/auth.svelte.js'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import EndPlaceholder from '$lib/components/ui/EndPlaceholder.svelte'
  import Entity from '$lib/components/ui/Entity.svelte'
  import CommonList from '$lib/components/ui/layout/CommonList.svelte'
  import Header from '$lib/components/ui/layout/pages/Header.svelte'
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import { t } from '$lib/i18n/translations.js'
  import { getClient } from '$lib/client/lemmy.svelte'
  import type {
    CommunityBlockView,
    InstanceBlockView,
    PersonBlockView,
  } from 'lemmy-js-client'
  import { Button } from 'mono-svelte'
  import { Check, Icon, XMark } from 'svelte-hero-icons'
  import type { PageData } from './$types.js'

  interface Props {
    // sveltekit doesn't feel like making types work right now
    data: PageData & {
      person_blocks: PersonBlockView[]
      community_blocks: CommunityBlockView[]
    }
  }

  let { data: pageData }: Props = $props()
  let data = $state(pageData)

  async function unblockUser(item: PersonBlockView) {
    if (!profile.current?.jwt) return

    data.person_blocks.splice(
      data.person_blocks.findIndex(i => i.target.id == item.target.id),
      1,
    )
    // hack to get reactivity working
    data.person_blocks = data.person_blocks

    await getClient().blockPerson({
      block: false,
      person_id: item.target.id,
    })
  }

  async function unblockCommunity(item: CommunityBlockView) {
    if (!profile.current?.jwt) return

    data.community_blocks.splice(
      data.community_blocks.findIndex(i => i.community.id == item.community.id),
      1,
    )

    // hack to get reactivity working
    data.community_blocks = data.community_blocks

    await getClient().blockCommunity({
      block: false,
      community_id: item.community.id,
    })
  }

  async function unblockInstances(item: InstanceBlockView) {
    if (!profile.current?.jwt) return
    if (!data.my_user?.instance_blocks) return

    data.my_user.instance_blocks.splice(
      data.my_user.instance_blocks.findIndex(
        i => i.instance.id == item.instance.id,
      ),
      1,
    )
    data.my_user.instance_blocks = data.my_user.instance_blocks

    await getClient().blockInstance({
      block: false,
      instance_id: item.instance.id,
    })
  }
</script>

<Header pageHeader>
  {$t('routes.profile.blocks.title')}
</Header>

<div>
  {#if data.community_blocks?.length > 0 || data.person_blocks?.length > 0 || (data.my_user?.instance_blocks?.length ?? 0) > 0}
    {#if data.community_blocks?.length > 0}
      <EndPlaceholder size="md" margin="md">
        {$t('content.communities')}
      </EndPlaceholder>
      <div class="max-h-96 overflow-auto rounded-2xl">
        <CommonList
          size="xs"
          class="px-3 py-2"
          animate={false}
          items={data.community_blocks}
        >
          {#snippet item(block)}
            <div class="flex flex-row gap-2 items-center">
              <CommunityLink community={block.community} avatar />
              <div class="flex-1"></div>
              <Button
                title="Unblock"
                size="square-md"
                rounding="pill"
                onclick={() => unblockCommunity(block)}
              >
                {#snippet prefix()}
                  <Icon src={XMark} micro size="16" />
                {/snippet}
              </Button>
            </div>
          {/snippet}
        </CommonList>
      </div>
    {/if}
    {#if data.person_blocks?.length > 0}
      <EndPlaceholder size="md" margin="md">
        {$t('content.users')}
      </EndPlaceholder>
      <div class="max-h-96 overflow-auto rounded-2xl">
        <CommonList
          size="xs"
          class="px-3 py-2"
          animate={false}
          items={data.person_blocks}
        >
          {#snippet item(block)}
            <div class="flex flex-row gap-2 items-center">
              <UserLink user={block.target} avatar badges />
              <div class="flex-1"></div>
              <Button
                title="Unblock"
                size="square-md"
                rounding="pill"
                onclick={() => unblockUser(block)}
              >
                {#snippet prefix()}
                  <Icon src={XMark} micro size="16" />
                {/snippet}
              </Button>
            </div>
          {/snippet}
        </CommonList>
      </div>
    {/if}
    {#if data.my_user?.instance_blocks && (data.my_user?.instance_blocks?.length ?? 0) > 0}
      <EndPlaceholder size="md" margin="md" class="text-lg">
        {$t('content.instances')}
      </EndPlaceholder>
      <div class="max-h-96 overflow-auto rounded-2xl">
        <CommonList
          size="xs"
          animate={false}
          items={data.my_user.instance_blocks}
          class="px-3 py-2"
        >
          {#snippet item(block)}
            <div class="flex flex-row gap-2 items-center">
              <Entity
                icon={block.site?.icon}
                name={block.site?.name ?? block.instance.domain}
                label={block.instance.domain}
              />
              <div class="flex-1"></div>
              <Button
                title="Unblock"
                size="square-md"
                rounding="pill"
                onclick={() => unblockInstances(block)}
              >
                {#snippet prefix()}
                  <Icon src={XMark} micro size="16" />
                {/snippet}
              </Button>
            </div>
          {/snippet}
        </CommonList>
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
</div>
