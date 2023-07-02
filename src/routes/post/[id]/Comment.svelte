<script lang="ts">
  import { ArrowDown, ArrowUp, Icon, Minus, Plus } from 'svelte-hero-icons'
  import Avatar from './Avatar.svelte'
  import type { CommentNodeI } from './comments.js'
  import SvelteMarkdown from 'svelte-markdown'
  import RelativeDate from '$lib/components/RelativeDate.svelte'
  import Button from '$lib/components/Button.svelte'
  import { Color } from '$lib/ui/colors.js'

  export let node: CommentNodeI
  export let open = true
</script>

<li class="py-3">
  <details bind:open class="flex flex-col gap-1">
    <summary
      class="flex flex-row cursor-pointer arrow gap-2 items-center group"
    >
      <Avatar
        url={node.comment_view.creator.avatar ??
          `https://api.dicebear.com/6.x/initials/svg?seed=${node.comment_view.creator.name}`}
        width={24}
      />
      <span class="text-sm">{node.comment_view.creator.name}</span>
      <span class="text-sm opacity-60">
        {node.comment_view.counts.score} point{node.comment_view.counts.score ==
        1
          ? ''
          : 's'}
      </span>
      <span class="text-sm opacity-60">
        <RelativeDate date={new Date(node.comment_view.comment.published)} />
      </span>
      <span
        class="ml-auto translate-x-1 opacity-0
        group-hover:translate-x-0 group-hover:opacity-100 text-xs transition-all
        flex flex-row items-center gap-1 hover:dark:bg-white/10 p-1 rounded-md
        hover:bg-black/10 px-2"
      >
        {#if open}
          <div class="inline">
            <Icon src={Minus} width={16} height={16} mini />
          </div>
          Collapse
        {:else}
          <Icon src={Plus} width={16} height={16} mini />
          Expand
          {#if node.children.length > 0}
            <span class="text-xs opacity-50">+{node.children.length}</span>
          {/if}
        {/if}
      </span>
    </summary>
    <div class="mt-1">
      <div
        class="flex flex-col gap-1 whitespace-pre-wrap
      max-w-full"
      >
        <div class="max-w-full break-words">
          <SvelteMarkdown source={node.comment_view.comment.content} />
        </div>
        <div class="flex flex-row gap-2">
          <button>
            <Icon src={ArrowUp} width={16} mini />
          </button>
          <span class="text-sm font-medium">
            {node.comment_view.counts.score}
          </span>
          <button>
            <Icon src={ArrowDown} width={16} mini />
          </button>
        </div>
      </div>
    </div>
    <slot />
  </details>
</li>
