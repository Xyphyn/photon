<script lang="ts">
  import UserLink from '$lib/components/lemmy/user/UserLink.svelte'
  import Card from '$lib/components/ui/Card.svelte'
  import { fly } from 'svelte/transition'
  import Report from './Report.svelte'
  import MultiSelect from '$lib/components/input/MultiSelect.svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { EnvelopeOpen, Icon } from 'svelte-hero-icons'
  import { searchParam } from '$lib/util.js'
  import Layout from '../+layout.svelte'
  import Navbar from '$lib/components/ui/Navbar.svelte'

  export let data
</script>

<Layout>
  <Navbar slot="navbar" class="max-sm:pb-0">
    <div class="sm:hidden">
      <MultiSelect
        headless
        selected={data.type}
        options={['all', 'unread']}
        optionNames={['All', 'Unread']}
        on:select={(e) => searchParam($page.url, 'type', e.detail, 'page')}
      />
    </div>
  </Navbar>
  <div class="mb-4 flex flex-col gap-4">
    <h1 class="font-black text-3xl">Reports</h1>
    <div class="max-sm:hidden">
      <MultiSelect
        selected={data.type}
        options={['all', 'unread']}
        optionNames={['All', 'Unread']}
        on:select={(e) => searchParam($page.url, 'type', e.detail, 'page')}
      />
    </div>
  </div>
  {#if data.items && data.items.length > 0}
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
  {:else}
    <div
      class="text-slate-600 dark:text-zinc-400 flex flex-col justify-center items-center py-8 gap-2"
    >
      <Icon src={EnvelopeOpen} size="48" />
      <div>
        <h1 class="font-bold text-3xl">No reports</h1>
        <p class="mt-2 text-center">You're all caught up!</p>
      </div>
    </div>
  {/if}
</Layout>
