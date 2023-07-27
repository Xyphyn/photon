<script lang="ts">
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { fly } from 'svelte/transition'
  import Report from './Report.svelte'

  export let data
</script>

{#if data.items}
  <div class="flex flex-col gap-4">
    {#each data.items as item}
      <div in:fly={{ y: -6, opacity: 0, duration: 500 }}>
        <Card
          class="p-4 flex flex-col gap-4 text-sm !bg-slate-100 dark:!bg-zinc-950"
        >
          <div class="flex flex-col gap-1.5">
            <span class="text-xs font-bold dark:text-zinc-400 text-slate-600">
              Report from
            </span>
            <span class="font-bold">
              <UserLink avatar user={item.creator} />
            </span>
          </div>

          <Report {item} />
        </Card>
      </div>
    {/each}
  </div>
{/if}
