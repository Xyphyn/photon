<script lang="ts">
  import CommunityHeader from '$comp/lemmy/community/CommunityHeader.svelte'
  import { Header } from '$comp/ui/layout'
  import { t } from '$lib/app/i18n'
  import { Button, Material, Spinner } from 'mono-svelte'
  import ModlogItemCard from '../../../modlog/item/ModlogItemCard.svelte'
  import Expandable from 'mono-svelte/disclosure/Expandable.svelte'
  import UserAutocomplete from '$comp/lemmy/user/UserAutocomplete.svelte'
  import { ban } from '$comp/lemmy/moderation/moderation'
  import Switch from '$comp/input/Switch.svelte'

  let banFromCommunity = $state(false)

  let { data } = $props()
</script>

<Header pageHeader>
  {#snippet extended()}
    <CommunityHeader
      community={data.community.community_view.community}
      counts={data.community.community_view.counts}
      moderators={data.community.moderators}
      subscribed={data.community.community_view.subscribed}
      banner={false}
    />
  {/snippet}
</Header>

<div
  class="flex flex-col *:py-2 divide-y divide-slate-200 dark:divide-zinc-800"
>
  <Expandable>
    {#snippet title()}
      {$t('routes.moderation.manage.modlogs')}
    {/snippet}
    <Material
      color="uniform"
      rounding="2xl"
      class="dark:bg-zinc-950 max-h-96 h-full overflow-auto space-y-4 mt-1"
    >
      {#await data.modlog}
        <Spinner width={24} />
      {:then log}
        {#each log as modLog}
          <ModlogItemCard item={modLog} />
        {/each}
        <div
          class="sticky -bottom-4 pb-4 w-full flex items-center bg-gradient-to-b from-white/0 to-white dark:from-zinc-950/0 dark:to-zinc-950"
        >
          <Button
            color="primary"
            rounding="pill"
            class="mx-auto"
            href="/modlog?community={data.community.community_view.community
              .id}"
          >
            {$t('form.post.readMore')}
          </Button>
        </div>
      {/await}
    </Material>
  </Expandable>
  <Expandable>
    {#snippet title()}
      <div>
        {$t('moderation.ban.banFromCommunity')}
      </div>
    {/snippet}
    <div class="flex flex-col gap-4">
      <Switch
        options={[false, true]}
        optionNames={[
          $t('routes.moderation.manage.ban'),
          $t('routes.moderation.manage.unban'),
        ]}
        bind:selected={banFromCommunity}
      />
      <UserAutocomplete
        onselect={(p) =>
          ban(banFromCommunity, p, data.community.community_view.community)}
        listing_type="All"
      />
    </div>
  </Expandable>
</div>
