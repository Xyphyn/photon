<script lang="ts">
  import type { Post, PostPoll } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import { CommonList } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import RelativeDate from '$lib/ui/util/RelativeDate.svelte'
  import { CheckBadge, Icon } from 'svelte-hero-icons/dist'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  interface Props {
    post: Post & { poll: PostPoll }
  }

  let { post }: Props = $props()

  let chosen = $state<number>()
  let totalVotes = $derived(
    post.poll.choices.reduce((a, b) => a + b.num_votes, 0),
  )

  let selected = $state<number>()

  // $effect used instead of $derived.by to emphasize
  // that there is a side effect used (newChoice/prevChoice vote manipulation)
  $effect(() => {
    if (selected) {
      castVote(selected)
    }
  })

  async function castVote(choice: number) {
    if (chosen == choice) return

    const prevChoice = post.poll.choices.find((i) => i.id == chosen)
    const newChoice = post.poll.choices.find((i) => i.id == choice)!

    if (prevChoice) {
      prevChoice.num_votes--
    }

    chosen = choice
    newChoice.num_votes++
  }
</script>

<form class="space-y-2">
  <CommonList class="">
    {#each post.poll.choices as choice}
      <li class="relative z-10 overflow-hidden">
        {#if chosen}
          <div
            in:slide={{ axis: 'x', duration: 500, easing: expoOut }}
            class="bg-primary-900/5 dark:bg-primary-100/10 absolute inset-0 -z-10 p-0!"
            style="width: {(choice.num_votes / totalVotes) *
              100}%; transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);"
          ></div>
        {/if}
        <label
          class="px-4 py-2 w-full text-left font-medium flex flex-row gap-2 items-center"
        >
          <input
            class="appearance-none absolute inset-0 cursor-pointer"
            name="poll={post.id}"
            value={choice.id}
            bind:group={selected}
            type="radio"
          />
          <div class={[chosen == choice.id ? 'opacity-100' : 'opacity-10']}>
            <Icon src={CheckBadge} size="24" mini />
          </div>
          <div>
            {choice.choice_text}
          </div>
          {#if chosen}
            <div class="ml-auto">
              {Math.floor((choice.num_votes / totalVotes) * 100)}%
            </div>
          {/if}
        </label>
      </li>
    {/each}
  </CommonList>
  <EndPlaceholder size="md" margin="bottom-sm">
    {$t('post.poll.votes', { votes: totalVotes })}
    {#snippet action()}
      {#if post.poll.latest_vote}
        <RelativeDate date={publishedToDate(post.poll.latest_vote)} />
      {/if}
    {/snippet}
  </EndPlaceholder>
</form>
