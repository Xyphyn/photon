<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import { Icon, Trash, XCircle } from 'svelte-hero-icons'
  import type { ModLog } from './+page.js'

  export let item: ModLog
</script>

<tr class="">
  <td>
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
    {/if}
  </td>
  <td>
    <span class="font-bold">
      {#if item.actionName == 'ban'}
        <span class="flex items-center gap-1 text-red-600 dark:text-red-400">
          <Icon src={XCircle} size="16" mini class="inline flex-shrink-0" /> Ban
        </span>
      {:else if item.actionName == 'postRemoval' || item.actionName == 'commentRemoval'}
        <span class="flex items-center gap-1 text-red-600 dark:text-red-400">
          <Icon src={Trash} size="16" mini class="inline flex-shrink-0" /> Removal
        </span>
      {:else}
        {item.actionName}
      {/if}
    </span>
  </td>
  <td>
    {#if item.moderatee}
      <UserLink showInstance={false} user={item.moderatee} />
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
    {#if item.content}
      <p>{item.content}</p>
    {/if}
  </td>
  <td>
    {#if item.reason}
      <p>{item.reason}</p>
    {/if}
  </td>
  <td>
    {#if item.link}
      <Link highlight href={item.link} />
    {/if}
  </td>
</tr>
