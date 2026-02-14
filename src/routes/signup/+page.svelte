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
  import { goto } from '$app/navigation'
  import { validateInstance } from '$lib/api/client.svelte'
  import { t } from '$lib/app/i18n'
  import { DEFAULT_INSTANCE_URL } from '$lib/app/instance.svelte'
  import VirtualList from '$lib/app/render/VirtualList.svelte'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { CommonList, Header } from '$lib/ui/layout'
  import { Button, TextInput, toast } from 'mono-svelte'
  import { onMount } from 'svelte'
  import { ArrowLeft, Icon } from 'svelte-hero-icons/dist'
  import { preventDefault } from 'svelte/legacy'

  let selectedInstance: string = $state('')
  let validating: boolean = $state(false)
  let placeholder = $state(DEFAULT_INSTANCE_URL)

  let instances: Instance[] | undefined = $state(undefined)

  onMount(async () => {
    try {
      const res: Instance[] = (
        await fetch(`https://servers.infra.phtn.app?limit=30`).then((r) =>
          r.json(),
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
  {#if instances}
    <CommonList>
      <VirtualList
        items={instances}
        useWindow={false}
        height={384}
        estimatedHeight={50}
        class="overflow-auto overflow-x-hidden w-full min-w-0 min-h-96"
        itemContainer="li"
      >
        {#snippet item(i)}
          {@const instance = instances![i]}
          <button
            onclick={() => (selectedInstance = instance.baseurl ?? '')}
            class="flex flex-row items-center text-left gap-2 w-full cursor-pointer"
          >
            <Avatar
              width={32}
              url={instance.icon}
              alt={instance.name}
              class="shrink-0"
            />
            <div class="flex flex-col max-h-full w-full">
              <div
                class="font-medium text-base whitespace-nowrap text-ellipsis flex"
              >
                <span>
                  {instance.name}
                </span>
                <span class="text-slate-500 dark:text-zinc-500 ml-auto">
                  {instance.baseurl}
                </span>
              </div>

              <p
                class="overflow-hidden overflow-ellipsis w-full text-sm text-slate-600 dark:text-zinc-400"
              >
                {instance.desc}
              </p>
            </div>
          </button>
        {/snippet}
      </VirtualList>
    </CommonList>
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
