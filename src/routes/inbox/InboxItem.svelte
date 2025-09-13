<script lang="ts">
  // ...existing imports...
  import { onMount } from 'svelte';

  // ...existing code...

  // Automatically mark as read when rendered
  onMount(() => {
    if (!item.read && !loading) {
      markAsRead(true);
    }
  });
</script>

<Expandable open icon={false}>
  {#snippet title()}
    <div class="flex flex-row gap-2 items-center w-full">
      <Avatar url={item.creator.avatar} width={28} alt={item.creator.name} />
      <div class="flex flex-col">
        <div class="text-sm font-normal text-slate-600 dark:text-zinc-400">
          {#if item.type == 'comment_reply'}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $t('routes.inbox.item.reply', {
              user: `<strong>${item.creator.name}</strong>`,
              post: `<strong>${escapeHtml(item.item.post.name)}</strong>`,
            })}
          {:else if item.type == 'person_mention'}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $t('routes.inbox.item.mention', {
              user: `<strong>${item.creator.name}</strong>`,
              post: `<strong>${escapeHtml(item.item.post.name)}</strong>`,
            })}
          {:else if item.type == 'private_message'}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html $t('routes.inbox.item.message', {
              user: `<strong>${item.item.creator.name}</strong>`,
              recipient: `<strong>${item.item.recipient.name}</strong>`,
            })}
          {/if}
        </div>
        <div class="text-xs text-slate-600 dark:text-zinc-400">
          <RelativeDate date={publishedToDate(item.published)} />
        </div>
      </div>
      <div class="flex-1"></div>
      <div class="flex gap-2 max-md:hidden shrink-0">
        <Button
          href={item.type == 'private_message'
            ? `/inbox/messages/${item.item.private_message.creator_id}`
            : `/comment/${item.item.comment.id}`}
          size="sm"
          rounding="pill"
          class="shrink-0"
        >
          {$t('common.jump')}
        </Button>
      </div>
    </div>
  {/snippet}
  {#snippet extended()}
    <div class="flex gap-2 w-full md:hidden mt-1 flex-wrap">
      <!-- Removed mark as read/unread button -->
    </div>
  {/snippet}
</Expandable>
