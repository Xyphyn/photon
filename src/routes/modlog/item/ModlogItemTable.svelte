<script lang="ts">
  import type { ModlogView } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import CommunityLink from '$lib/feature/community/CommunityLink.svelte'
  import { postLink } from '$lib/feature/post'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import { Button, modal } from 'mono-svelte'
  import RelativeDate from 'mono-svelte/util/RelativeDate.svelte'
  import ModlogAction from './ModlogAction.svelte'

  interface Props {
    item: ModlogView
  }

  let { item }: Props = $props()
</script>

{#snippet itemInfo()}
  {#if item.target_post || item.target_comment}
    <Button
      color="primary"
      rounding="pill"
      class="w-max"
      href={item.target_post ? postLink(item.target_post) : `/comment/${item.target_comment!.id}`}
    >
      {$t('common.jump')}
    </Button>
  {/if}
  {#if item.target_person}
    <UserLink avatar user={item.target_person} />
  {/if}
  <div>
    {item.target_post ? item.target_post.name : item.target_comment?.content}
  </div>
{/snippet}

<tr class="">
  <td style="width: 10%;">
    <span>
      <RelativeDate date={new Date(item.modlog.published_at)} />
    </span>
  </td>
  <td>
    {#if item.moderator}
      <UserLink showInstance={false} avatar avatarSize={20} user={item.moderator} />
    {:else}
      <p class="text-slate-500 dark:text-zinc-500">Unknown</p>
      <p></p>
    {/if}
  </td>
  <td>
    {#if item.target_community}
      <CommunityLink
        showInstance={false}
        avatar
        avatarSize={20}
        community={item.target_community}
      />
    {:else if item.target_instance}
      {item.target_instance.domain}
    {/if}
  </td>
  <td>
    <ModlogAction action={item.modlog} />
  </td>
  <td>
    {#if item.modlog.reason}
      <p>{item.modlog.reason}</p>
    {/if}
  </td>
  <td align="right">
    {#if item.target_post || item.target_comment}
      <Button size="sm" onclick={() => modal({ title: $t('common.info'), snippet: itemInfo })}>
        {$t('common.info')}
      </Button>
    {:else if item.target_person}
      <UserLink user={item.target_person} />
    {/if}
  </td>
</tr>
