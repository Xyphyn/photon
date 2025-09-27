<script lang="ts">
  import CommunityLink from '$lib/feature/community/CommunityLink.svelte'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import Link from '$lib/ui/form/Link.svelte'
  import { Label, Material } from 'mono-svelte'
  import RelativeDate from 'mono-svelte/util/RelativeDate.svelte'
  import type { ModLog } from '../+page'
  import ModlogAction from '../ModlogAction.svelte'

  interface Props {
    item: ModLog
  }

  let { item }: Props = $props()
</script>

<Material color="uniform" rounding="2xl" class="flex flex-col">
  <div class="flex flex-row justify-between flex-wrap gap-2">
    {#if item.community}
      <CommunityLink community={item.community} avatar showInstance />
    {/if}
    <Label class="font-normal">
      <RelativeDate date={new Date(item.timestamp)} />
    </Label>
  </div>
  {#if item.actionName}
    <Label class="mt-2">Action</Label>
    <span class="text-base">
      <ModlogAction action={item.actionName} />
    </span>
  {/if}
  {#if item.moderator}
    <Label class="mt-2">Moderator</Label>
    <span
      class="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium"
    >
      <UserLink showInstance={true} avatar user={item.moderator} />
    </span>
  {/if}
  {#if item.moderatee}
    <Label class="mt-2">User</Label>
    <UserLink showInstance={true} avatar user={item.moderatee} />
  {/if}
  {#if item.link || item.content}
    <Label class="mt-2">Item</Label>
    {#if item.link && item.content}
      <Link href={item.link} highlight>
        {item.content}
      </Link>
    {:else if item.content}
      <p>{item.content}</p>
    {:else if item.link}
      <Link href={item.link} highlight />
    {/if}
  {/if}
  {#if item.reason}
    <Label class="mt-2">Reason</Label>
    <p>{item.reason}</p>
  {/if}
</Material>
