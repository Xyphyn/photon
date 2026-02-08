<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import CommunityItem from '$lib/feature/community/CommunityItem.svelte'
  import { CommonList, Header } from '$lib/ui/layout'
  import { Button, Spinner } from 'mono-svelte'
</script>

<Header pageHeader>
  {$t('nav.communities')}
</Header>
<div class="w-full h-full flex flex-col mt-4">
  {#if !profile.current.user}
    <div class="mx-auto my-auto">
      <Spinner width={24} />
    </div>
  {:else}
    <CommonList items={profile.current.user.moderates}>
      {#snippet item(moderate)}
        {@const community = moderate.community}
        <CommunityItem
          community={{
            banned_from_community: false,
            blocked: false,
            community: community,
            counts: {
              comments: 0,
              community_id: 0,
              posts: 0,
              published: '2023-10-05',
              subscribers: 0,
              subscribers_local: 0,
              users_active_day: 0,
              users_active_half_year: 0,
              users_active_month: 0,
              users_active_week: 0,
            },
            subscribed: 'NotSubscribed',
          }}
        >
          <Button
            href="/moderation?community={community.id}"
            color="secondary"
            rounding="pill"
            size="sm"
            class="h-max self-center"
          >
            {$t('routes.moderation.feed')}
          </Button>
          <div class="w-2"></div>
          <Button
            href="/moderation/c/{community.id}"
            color="primary"
            rounding="pill"
            size="sm"
            class="h-max self-center"
          >
            {$t('routes.moderation.manage.title')}
          </Button>
        </CommunityItem>
      {/snippet}
    </CommonList>
  {/if}
</div>
