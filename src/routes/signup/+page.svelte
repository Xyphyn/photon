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
    recommended?: boolean
  }
</script>

<script lang="ts">
  import { goto } from '$app/navigation'
  import { env } from '$env/dynamic/public'
  import { validateInstance } from '$lib/api/client.svelte'
  import { t } from '$lib/app/i18n'
  import { DEFAULT_INSTANCE_URL } from '$lib/app/instance.svelte'
  import VirtualList from '$lib/app/render/VirtualList.svelte'
  import { loader } from '$lib/app/util.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { CommonList, Header } from '$lib/ui/layout'
  import { Button, Note, TextInput, toast } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { ArrowLeft } from 'svelte-hero-icons/dist'

  let selectedInstance: string = $state('')
  let placeholder = $state(DEFAULT_INSTANCE_URL)

  let validating = $state(false)
  let loading = $state(false)

  let instances = $state<Instance[]>([])

  onMount(async () => {
    try {
      const recommended = env.PUBLIC_RECOMMENDED_INSTANCES?.split(',')

      const res: Instance[] = (
        (await fetch(`https://servers.infra.phtn.app?limit=50`).then((r) => r.json())) as Instance[]
      )
        .filter((i: Instance) => i.fed)
        .sort((a: Instance, b: Instance) => b.score - a.score)
        .slice(0, 100)

      recommended?.forEach((rec) => {
        const found = res.find((i) => i.baseurl == rec)
        if (found) res.unshift({ ...found, recommended: true })
      })

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

  const pick = (instance?: string) =>
    loader(
      (v) => (instance != null ? (validating = v) : (loading = v)),
      async () => {
        if (!instances) return
        if (!instance)
          selectedInstance =
            instances[Math.floor(Math.random() * Math.max(5, instances.length))].baseurl

        if (await validateInstance(selectedInstance.trim())) {
          goto(`/signup/${encodeURIComponent(selectedInstance)}`)
        } else {
          throw new Error($t('toast.failInstanceURL'))
        }
      },
    )
</script>

<svelte:head>
  <title>{$t('form.signup.title')}</title>
</svelte:head>

<div class="mx-auto max-w-xl flex flex-col gap-4 my-auto w-full max-h-full p-8 sm:py-16">
  <Button href="/accounts" class="mb-4 w-max" icon={ArrowLeft}>
    {$t('common.back')}
  </Button>
  <Header>{$t('form.signup.title')}</Header>
  <p>{$t('form.signup.description')}</p>
  <Note>{$t('form.signup.info')}</Note>
  <div class="list-container flex-1 min-h-full flex flex-col">
    <CommonList>
      <VirtualList
        items={instances}
        useWindow={false}
        estimatedHeight={50}
        class="h-full! overflow-auto overflow-x-hidden w-full min-w-0"
        itemContainer="li"
      >
        {#snippet item(i)}
          {@const instance = instances![i]}
          <button
            onclick={() => (selectedInstance = instance.baseurl ?? '')}
            class={[
              'flex flex-row items-center text-left w-full cursor-pointer rounded-[inherit] gap-4',
            ]}
          >
            <Avatar
              width={32}
              url={instance.icon}
              alt={instance.name}
              circle={false}
              class="shrink-0"
            />
            <div class="flex flex-col max-h-full w-full">
              <div class="font-medium text-base whitespace-nowrap text-ellipsis flex">
                <span>
                  {instance.name}
                </span>
              </div>

              <p
                class="overflow-hidden text-ellipsis w-full text-sm text-slate-600 dark:text-zinc-500"
              >
                {instance.desc}
              </p>
            </div>
          </button>
        {/snippet}
        <div
          class="sticky bottom-0 bg-linear-to-b from-slate-25/0 to-slate-25 dark:from-zinc-925/0 dark:to-zinc-925 h-16"
        ></div>
      </VirtualList>
    </CommonList>
  </div>
  <form class="flex flex-col gap-4">
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
      onclick={() => pick(selectedInstance)}
      submit
      color="primary"
      size="lg"
      loading={validating}
    >
      {$t('form.submit')}
    </Button>
    <Button onclick={() => pick()} color="secondary" size="lg" {loading}>
      {$t('form.signup.pickForMe')}
    </Button>
  </form>
</div>

<style>
  .list-container :global(ul) {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    min-height: 0;
  }
</style>
