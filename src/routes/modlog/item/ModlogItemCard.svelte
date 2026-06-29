<script lang="ts">
  import CommunityLink from '$lib/feature/community/CommunityLink.svelte'
  import { postLink } from '$lib/feature/post'
  import UserLink from '$lib/feature/user/UserLink.svelte'
  import Link from '$lib/ui/form/Link.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import type { ModlogView } from 'lemmy-js-client'
  import { Label, Material } from 'mono-svelte'
  import RelativeDate from 'mono-svelte/util/RelativeDate.svelte'
  import ModlogAction from './ModlogAction.svelte'

  interface Props {
    item: ModlogView
  }

  let { item }: Props = $props()
</script>

<Material color="uniform" rounding="2xl" class="flex flex-col">
  <div class="flex flex-row justify-between flex-wrap gap-2">
    {#if item.target_community}
      <CommunityLink community={item.target_community} avatar showInstance />
    {/if}
    <Label class="font-normal">
      <RelativeDate date={publishedToDate(item.modlog.published_at)} />
    </Label>
  </div>
  <Label class="mt-2">Action</Label>
  <span class="text-base">
    <ModlogAction action={item.modlog} />
  </span>
  {#if item.moderator}
    <Label class="mt-2">Moderator</Label>
    <span class="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
      <UserLink showInstance={true} avatar user={item.moderator} />
    </span>
  {/if}
  {#if item.target_person}
    <Label class="mt-2">User</Label>
    <UserLink showInstance={true} avatar user={item.target_person} />
  {/if}
  {#if item.target_post || item.target_comment}
    <Label class="mt-2">Item</Label>
    {#if item.target_post}
      <Link href={postLink(item.target_post)} highlight>
        {item.target_post.name}
      </Link>
    {:else if item.target_comment}
      <Link href="/comment/{item.target_comment.id}" highlight>
        {item.target_comment.content}
      </Link>
    {/if}
  {/if}
  {#if item.modlog.reason}
    <Label class="mt-2">Reason</Label>
    <p>{item.modlog.reason}</p>
  {/if}
</Material>
