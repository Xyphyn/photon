<script module lang="ts">
  export interface Instance {
    baseurl: string
    name: string
    desc: string
    fed: boolean
    downvotes: boolean
    icon: string
    banner: string
    langs?: string[]
    tags?: string[]
    score: number
  }
</script>

<script lang="ts">
  import { preventDefault } from 'svelte/legacy'

  import { goto } from '$app/navigation'
  import VirtualList from '$lib/components/render/VirtualList.svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import { Header } from '$lib/components/ui/layout'
  import { t } from '$lib/i18n/translations'
  import { DEFAULT_INSTANCE_URL } from '$lib/instance.svelte.js'
  import { validateInstance } from '$lib/client/lemmy.svelte'
  import { Button, TextInput, toast } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { ArrowLeft, Icon } from 'svelte-hero-icons'

  let selectedInstance: string = $state('')
  let validating: boolean = $state(false)
  let placeholder = $state(DEFAULT_INSTANCE_URL)

  let instances: Instance[] | undefined = $state(undefined)

  onMount(async () => {
    try {
      const res: Instance[] = (
        await fetch(`https://data.lemmyverse.net/data/instance.full.json`).then(
          (r) => r.json(),
        )
      )
        .filter((i: Instance) => i.fed)
        .sort((a: Instance, b: Instance) => b.score - a.score)
        .slice(0, 100)

      instances = res

      let placeholderIndex = 0
      setInterval(() => {
        if (!instances) return
        if (placeholderIndex >= instances.length) placeholderIndex = 0
        placeholder = instances?.[placeholderIndex].baseurl
        placeholderIndex++
      }, 2000)
    } catch {
      toast({
        content: $t('toast.failFetchInstances'),
        type: 'error',
      })
    }
  })
</script>

<svelte:head>
  <title>{$t('form.signup.title')}</title>
</svelte:head>

<div class="mx-auto max-w-xl flex flex-col gap-4 my-auto h-max w-full">
  <Button href="/accounts" class="mb-4 w-max" rounding="pill">
    <Icon src={ArrowLeft} size="16" micro />
    {$t('common.back')}
  </Button>
  <Header>{$t('form.signup.title')}</Header>
  <p>{$t('form.signup.description')}</p>
  <p>
    {$t('form.signup.info')}
  </p>
  {#if instances}
    <VirtualList
      items={instances}
      useWindow={false}
      height={400}
      estimatedHeight={50}
      class="overflow-auto border rounded-2xl border-slate-200 dark:border-zinc-900 bg-white dark:bg-zinc-950
      divide-y divide-slate-200 dark:divide-zinc-900"
    >
      {#snippet item(i)}
        <button
          onclick={() => (selectedInstance = instances![i].baseurl ?? '')}
          class="flex flex-row gap-2 text-left py-2 first:pt-0 last:pb-0 items-center
            h-16 max-h-16 min-h-16 overflow-hidden w-full cursor-pointer hover:bg-slate-50 hover:dark:bg-zinc-925 duration-100
            p-4"
        >
          <Avatar
            width={32}
            url={instances![i].icon}
            alt={instances![i].name}
            class="shrink-0"
          />
          <div class="flex flex-col max-h-full w-full">
            <span class="font-medium text-base whitespace-nowrap text-ellipsis">
              {instances![i].name}
            </span>
            <span
              class="whitespace-nowrap text-ellipsis overflow-hidden w-full"
            >
              {instances![i].desc}
            </span>
          </div>
        </button>
      {/snippet}
    </VirtualList>
  {/if}
  <form
    class="flex flex-col gap-4"
    onsubmit={preventDefault(async () => {
      if (selectedInstance != '') {
        validating = true

        if (await validateInstance(selectedInstance.trim())) {
          goto(`/signup/${encodeURIComponent(selectedInstance)}`)
        } else {
          toast({
            content: $t('toast.failInstanceURL'),
            type: 'error',
          })
        }

        validating = false
      }
    })}
  >
    <TextInput
      bind:value={selectedInstance}
      label={$t('form.signup.chooseInstance')}
      required
      {placeholder}
      oninput={() => {
        selectedInstance = selectedInstance.toLowerCase().replaceAll(' ', '')
      }}
    />
    <Button
      submit
      color="primary"
      size="lg"
      loading={validating}
      disabled={validating}
    >
      {$t('form.submit')}
    </Button>
  </form>
</div>
