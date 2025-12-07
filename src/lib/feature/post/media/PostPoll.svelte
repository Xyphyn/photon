<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import { PiefedClient } from '$lib/api/piefed/adapter'
  import type { Post, PostPoll } from '$lib/api/types'
  import { profile } from '$lib/app/auth.svelte'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import { CommonList } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import { formatRelativeDate } from '$lib/ui/util/RelativeDate.svelte'
  import { Button, toast } from 'mono-svelte'
  import { expoOut } from 'svelte/easing'
  import { slide } from 'svelte/transition'

  interface Props {
    post: Post & { poll: PostPoll }
  }

  let { post }: Props = $props()

  let selected = $state<number | number[] | undefined>(
    post.poll.my_votes?.length == 1
      ? post.poll.my_votes[0]
      : post.poll.my_votes,
  )

  let canVote = $state<boolean>(
    !(
      (post.poll.end_poll &&
        publishedToDate(post.poll.end_poll).getTime() < Date.now()) ||
      !profile.current.jwt ||
      (post.poll.my_votes?.length ?? 0) > 0
    ),
  )
  let chosen = $state<number | number[] | undefined>(canVote ? undefined : -1)

  let options = $derived(
    post.poll.choices.map((i) => ({
      ...i,
      num_votes:
        (typeof chosen !== 'number' && chosen?.includes(i.id)) || chosen == i.id
          ? i.num_votes + 1
          : i.num_votes,
    })),
  )
  let totalVotes = $derived(options.reduce((a, b) => a + b.num_votes, 0))

  let loading = $state(false)

  async function castVote(id: number | number[]) {
    try {
      const api = client()
      if (!(api instanceof PiefedClient)) throw new Error('unsupported')

      loading = true

      if (typeof id !== 'number') chosen = id
      else chosen = id

      canVote = false

      if (typeof id !== 'number') {
        await api.voteOnPoll({
          post_id: post.id,
          choice_id: id,
        })
      } else {
        await api.voteOnPoll({
          post_id: post.id,
          choice_id: [id],
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
      chosen = undefined
      canVote = true
    } finally {
      loading = false
    }
  }
</script>

<form
  class="space-y-2"
  onsubmit={(e) => {
    e.preventDefault()
    castVote(selected!)
  }}
>
  <CommonList class="">
    {#each options.toSorted((a, b) => a.sort_order - b.sort_order) as choice}
      {@const active =
        selected == choice.id ||
        (typeof selected !== 'number' && selected?.includes(choice.id))}
      {@const percentage = Math.floor(
        (choice.num_votes / totalVotes || 0) * 100,
      )}
      {@const multi = post.poll.mode != 'single'}
      <li
        class="relative z-10 overflow-hidden has-disabled:pointer-events-none"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={percentage}
      >
        {#if chosen}
          <div
            in:slide={{ axis: 'x', duration: 500, easing: expoOut }}
            class={[
              'absolute inset-0 -z-10 p-0!',
              active
                ? 'bg-primary-900/10 dark:bg-primary-100/10'
                : 'bg-primary-900/5 dark:bg-primary-100/5',
            ]}
            style="width: {percentage}%; transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);"
          ></div>
        {/if}
        <label
          class="px-4 py-2 w-full text-left flex flex-row gap-2 items-center"
        >
          {#if !multi}
            <input
              class="appearance-none absolute inset-0 cursor-pointer w-full h-full peer"
              name="poll={post.id}"
              value={choice.id}
              bind:group={selected}
              type="radio"
              disabled={!canVote}
            />
          {:else}
            <input
              class="appearance-none absolute inset-0 cursor-pointer w-full h-full peer"
              name="poll={post.id}"
              value={choice.id}
              bind:group={selected}
              type="checkbox"
              disabled={!canVote}
            />
          {/if}
          <div
            class={['choice-indicator', multi ? 'rounded-md' : 'rounded-full']}
          >
            <div></div>
          </div>
          <div class={['choice-text', 'text-slate-600 dark:text-zinc-400']}>
            {choice.choice_text}
          </div>
          {#if chosen}
            <div class="ml-auto">
              {percentage}%
            </div>
          {/if}
        </label>
      </li>
    {/each}
  </CommonList>
  <EndPlaceholder size="md" margin="bottom-sm">
    {$t('post.poll.votes', { votes: totalVotes })}
    {#snippet action()}
      {#if (selected && canVote) || loading}
        <Button
          class="w-24"
          color="primary"
          submit
          {loading}
          disabled={loading}
        >
          {$t('form.submit')}
        </Button>
      {:else if post.poll.end_poll}
        {$t('post.poll.results.ends', {
          time: formatRelativeDate(publishedToDate(post.poll.end_poll), {}),
        })}
      {/if}
    {/snippet}
  </EndPlaceholder>
</form>

<style>
  @reference '../../../../app.css';

  input:checked ~ .choice-text {
    font-weight: var(--font-weight-medium);
    color: var(--color-primary-900);

    @variant dark {
      color: var(--color-primary-100);
    }
  }

  .choice-indicator {
    width: calc(var(--spacing) * 5);
    height: calc(var(--spacing) * 5);
    background: var(--color-slate-100);
    display: inline-grid;
    place-items: center;

    @variant dark {
      background: var(--color-zinc-800);
    }
  }

  input:checked ~ .choice-indicator > div {
    width: calc(var(--spacing) * 4);
    height: calc(var(--spacing) * 4);
    border-radius: inherit;
    background: var(--color-primary-900);

    @variant dark {
      background: var(--color-primary-100);
    }
  }

  li:has(label:focus-within) {
    border: 1px solid --alpha(var(--color-primary-900) / 50%);

    @variant dark {
      border-color: --alpha(var(--color-primary-100) / 50%);
    }
  }
</style>
