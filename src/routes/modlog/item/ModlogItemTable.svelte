<script lang="ts">
  import UserLink from '$comp/lemmy/user/UserLink.svelte'
  import RelativeDate from '$comp/util/RelativeDate.svelte'
  import { t } from '$lib/app/i18n/index.js'
  import { Button, modal } from 'mono-svelte'
  import type { ModLog } from '../+page.js'
  import ModlogAction from '../ModlogAction.svelte'
  import CommunityLink from '$comp/lemmy/community/CommunityLink.svelte'

  interface Props {
    item: ModLog
  }

  let { item }: Props = $props()
</script>

{#snippet itemInfo()}
  <Button color="primary" rounding="pill" class="w-max" href={item.link}>
    {$t('common.jump')}
  </Button>
  {#if item.moderatee}
    <UserLink avatar user={item.moderatee} />
  {/if}
  <div>
    {item.content}
  </div>
{/snippet}

<tr class="">
  <td style="width: 10%;">
    <span>
      <RelativeDate date={new Date(item.timestamp)} />
    </span>
  </td>
  <td>
    {#if item.moderator}
      <UserLink
        showInstance={false}
        avatar
        avatarSize={20}
        user={item.moderator}
      />
    {:else}
      <p class="text-slate-500 dark:text-zinc-500">Unknown</p>
      <p></p>
    {/if}
  </td>
  <td>
    {#if item.community}
      <CommunityLink
        showInstance={false}
        avatar
        avatarSize={20}
        community={item.community}
      />
    {/if}
  </td>
  <td>
    <ModlogAction action={item.actionName} />
  </td>
  <td>
    {#if item.reason}
      <p>{item.reason}</p>
    {/if}
  </td>
  <td align="right">
    {#if item.content}
      <Button
        size="sm"
        onclick={() => modal({ title: $t('common.info'), snippet: itemInfo })}
      >
        {$t('common.info')}
      </Button>
    {/if}
  </td>
</tr>
