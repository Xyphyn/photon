<script lang="ts">
  import { profile } from '$lib/app/auth'
  import { t } from '$lib/app/i18n'
  import { CommunityModel } from '$lib/feature/community/community-model.svelte'
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
          community={new CommunityModel({
            can_mod: true,
            community: community,
            tags: [],
          })}
        >
          <Button
            href="/moderation?community={community.id}"
            color="secondary"
            size="sm"
            class="h-max self-center"
          >
            {$t('routes.moderation.feed')}
          </Button>
          <Button
            href="/moderation/c/{community.id}"
            color="primary"
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
