<script lang="ts">
  import Placeholder from '$lib/components/ui/Placeholder.svelte'
  import RelativeDate from '$lib/components/util/RelativeDate.svelte'
  import SiteCard from '$lib/components/lemmy/SiteCard.svelte'
  import { publishedToDate } from '$lib/components/util/date.js'
  import { getClient } from '$lib/lemmy.js';
  import { Material, MenuButton, Modal, Popover, Spinner } from 'mono-svelte'
  import { Check, Icon, InformationCircle } from 'svelte-hero-icons'
  import type { Instance } from 'lemmy-js-client';

  export let data

  let instance: string | undefined = undefined
  let modalOpen: boolean = false

  const showModal = (_instance: Instance) => {
    instance = _instance.domain
    modalOpen = !modalOpen
  }
</script>

<Modal bind:open={modalOpen}>
  {#await getClient(instance).getSite()}
    <Spinner />
  {:then site}
  <SiteCard
    site={site.site_view}
    taglines={site.taglines}
    admins={site.admins}
    version={site.version}
  />
  {:catch}
    <p>Not a Lemmy instance</p>
  {/await}
</Modal>

<h1 class="font-bold text-3xl mb-4">Linked Instances</h1>
{#if data}
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-1 w-full max-h-[42rem] h-full flex flex-col gap-2">
      <h2 class="font-bold text-xl flex flex-row items-center gap-1">
        Linked
        <Popover openOnHover>
          <Icon src={InformationCircle} mini size="20" slot="target" />
          <p class="font-normal">
            These are the instances your instance can see and interact with
            content from.
          </p>
        </Popover>
      </h2>
      <Material
        class="h-full overflow-auto divide-y [&>*]:py-3 divide-slate-200 dark:divide-zinc-800"
        color="distinct"
      >
        {#if data.linked && data.linked.length > 0}
          {#each data.linked?.sort((b, a) => b.id - a.id) as instance}
            <div class="flex justify-between items-center first:pt-0 last:pb-0">
              <MenuButton on:click={() => showModal(instance)}>
                <div class="flex flex-col">
                  <span class="font-medium">{instance.domain}</span>
                  <span
                    class="text-xs text-slate-600 dark:text-zinc-400 capitalize"
                  >
                    {instance.software ?? 'Unknown'} • <RelativeDate
                      date={publishedToDate(instance.published)}
                    />
                  </span>
                </div>
              </MenuButton>
            </div>
          {/each}
        {:else}
          <Placeholder
            icon={Check}
            title="No linked instances"
            description="This instance likely has federation disabled."
          />
        {/if}
      </Material>
    </div>
    <div class="flex-1 w-full max-h-[42rem] h-full flex flex-col gap-2">
      <h2 class="font-bold text-xl flex flex-row items-center gap-1">
        Blocked

        <Popover openOnHover placement="bottom">
          <Icon src={InformationCircle} mini size="20" slot="target" />
          <p class="font-normal">
            These are the instances your instance is explicitly blocking content
            from.
          </p>
        </Popover>
      </h2>
      <Material
        class="h-full overflow-auto divide-y [&>*]:py-3 divide-slate-200 dark:divide-zinc-800"
        color="distinct"
      >
        {#if data.blocked && data.blocked.length > 0}
          {#each data.blocked?.sort((b, a) => b.id - a.id) as instance}
            <div class="flex justify-between items-center first:pt-0 last:pb-0">
              <div class="flex flex-col">
                <span class="font-medium">{instance.domain}</span>
                <span
                  class="text-xs text-slate-600 dark:text-zinc-400 capitalize"
                >
                  {instance.software ?? 'Unknown'} • <RelativeDate
                    date={publishedToDate(instance.published)}
                  />
                </span>
              </div>
            </div>
          {/each}
        {:else}
          <Placeholder
            icon={Check}
            title="No blocked instances"
            description="Blocking an instance will hide submissions from that instance."
          />
        {/if}
      </Material>
    </div>
  </div>
{/if}
