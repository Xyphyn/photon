<script lang="ts">
  import { t } from '$lib/app/i18n'
  import CommunityHeader from '$lib/feature/community/CommunityHeader.svelte'
  import { repos } from '$lib/feature/feeds/repo.svelte'
  import { ban } from '$lib/feature/moderation/moderation'
  import UserAutocomplete from '$lib/feature/user/UserAutocomplete.svelte'
  import Switch from '$lib/ui/form/Switch.svelte'
  import { Header } from '$lib/ui/layout'
  import { Button, Expandable, Material, Spinner } from 'mono-svelte'
  import ModlogItemCard from '../../../modlog/item/ModlogItemCard.svelte'

  let { data } = $props()

  let banFromCommunity = $state(false)
  let community = $derived(repos.communities.get(data.community.community_view))
</script>

<Header pageHeader>
  {#snippet extended()}
    <CommunityHeader
      community={community.community}
      counts
      moderators={data.community.moderators}
      subscribed={community.subscribed}
      banner={false}
    />
  {/snippet}
</Header>

<div class="flex flex-col *:py-2 divide-y divide-slate-200 dark:divide-zinc-800">
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
        {#each log.items as modLog}
          <ModlogItemCard item={modLog} />
        {/each}
        <div
          class="sticky -bottom-4 pb-4 w-full flex items-center bg-linear-to-b from-white/0 to-white dark:from-zinc-950/0 dark:to-zinc-950"
        >
          <Button
            color="primary"
            rounding="pill"
            class="mx-auto"
            href="/modlog?community={data.community.community_view.community.id}"
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
        optionNames={[$t('routes.moderation.manage.ban'), $t('routes.moderation.manage.unban')]}
        bind:selected={banFromCommunity}
      />
      <UserAutocomplete
        onselect={(p) => {
          if (!p) return
          ban(banFromCommunity, p, data.community.community_view.community)
        }}
        listing_type="all"
      />
    </div>
  </Expandable>
</div>
