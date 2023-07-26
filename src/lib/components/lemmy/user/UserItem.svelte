<script lang="ts">
  import type { PersonView } from 'lemmy-js-client'
  import {
    ChatBubbleOvalLeftEllipsis,
    Icon,
    PencilSquare,
  } from 'svelte-hero-icons'
  import FormattedNumber from '$lib/components/util/FormattedNumber.svelte'
  import UserLink from '$lib/components/user/UserLink.svelte'

  export let user: PersonView
</script>

<div
  class="py-2
  flex flex-col gap-3 text-sm max-w-full"
>
  <div class="flex flex-row items-center">
    <span
      class="break-words max-w-full w-max text-base font-bold text-sky-400 hover:underline"
    >
      <UserLink avatar user={user.person} />
    </span>
  </div>
  <div class="flex flex-row gap-3 items-center">
    <div class="flex flex-row gap-1 items-center" title="Post count">
      <Icon src={PencilSquare} mini width={16} />
      <FormattedNumber number={user.counts.post_count} />
    </div>
    <div class="flex flex-row gap-1 items-center" title="Comment count">
      <Icon src={ChatBubbleOvalLeftEllipsis} mini width={16} />
      <FormattedNumber number={user.counts.comment_count} />
    </div>
  </div>
</div>
