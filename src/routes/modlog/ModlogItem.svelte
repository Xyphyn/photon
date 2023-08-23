<script lang="ts">
  import Link from '$lib/components/input/Link.svelte'
  import CommunityLink from '$lib/components/lemmy/community/CommunityLink.svelte'
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import SectionTitle from '$lib/components/ui/SectionTitle.svelte'
  import type { ModLog } from './+page.js'

  export let item: ModLog
</script>

<Card elevation={0} class="p-5 flex flex-col gap-1 text-sm">
  <SectionTitle>Action</SectionTitle>
  <span class="font-bold text-base">{item.actionName}</span>
  {#if item.moderator}
    <SectionTitle class="mt-3">Moderator</SectionTitle>
    <UserLink avatar user={item.moderator} />
  {/if}
  {#if item.moderatee}
    <SectionTitle class="mt-3">Moderatee</SectionTitle>
    <UserLink avatar user={item.moderatee} />
  {/if}
  {#if item.community}
    <SectionTitle class="mt-3">Community</SectionTitle>
    <CommunityLink avatar community={item.community} />
  {/if}
  {#if item.link}
    <SectionTitle class="mt-3">Link</SectionTitle>
    <Link highlight href={item.link} />
  {/if}
</Card>
