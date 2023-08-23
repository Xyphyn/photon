<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import type { ModLog } from './+page.js'

  export let item: ModLog
</script>

<tr class="text-sm">
  <td>
    <span class="font-bold">{item.actionName}</span>
  </td>
  <td>
    {#if item.moderator}
      <UserLink showInstance={false} avatar user={item.moderator} />
    {/if}
  </td>
  <td>
    {#if item.moderatee}
      <UserLink showInstance={false} avatar user={item.moderatee} />
    {/if}
  </td>
  <td>
    {#if item.community}
      <CommunityLink showInstance={false} avatar community={item.community} />
    {/if}
  </td>
  <td>
    {#if item.link}
      <Link highlight href={item.link} />
    {/if}
  </td>
</tr>
