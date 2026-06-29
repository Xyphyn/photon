<script lang="ts">
  import { client } from '$lib/api/client.svelte'
  import type { Instance } from '$lib/api/types'
  import { profile } from '$lib/app/auth'
  import { errorMessage } from '$lib/app/error'
  import { t } from '$lib/app/i18n'
  import Placeholder from '$lib/ui/info/Placeholder.svelte'
  import { Header } from '$lib/ui/layout'
  import { publishedToDate } from '$lib/ui/util/date'
  import {
    Button,
    FileInput,
    Material,
    Popover,
    TextInput,
    toast,
  } from 'mono-svelte'
  import RelativeDate from 'mono-svelte/util/RelativeDate.svelte'
  import {
    Check,
    ExclamationTriangle,
    Icon,
    Plus,
    XMark,
  } from 'svelte-hero-icons/dist'
  import { flip } from 'svelte/animate'
  import { expoOut } from 'svelte/easing'
  import { preventDefault } from 'svelte/legacy'

  let { data } = $props()

  let blockedList = $state<Instance[]>([])
  let allowedList = $state<Instance[]>([])

  $effect(() => {
    blockedList = data.blocked
    allowedList = data.allowed
  })

  let blockInstance = $state({
      instance: '',
      loading: false,
    }),
    allowInstance = $state({
      instance: '',
      loading: false,
    }),
    saving = $state(false)

  async function moderateInstance(instance: string, blocked: boolean) {
    if (instance == '') return
    try {
      if (!profile.current?.jwt) return

      if (blocked) {
        blockInstance.loading = true
        await client().adminBlockInstance({ instance, block: true, reason: '' })
        const res = await client().getFederatedInstances({ kind: 'blocked', limit: 1000 })
        blockedList = res.items.map((i) => i.instance)
        blockInstance.instance = ''
      } else {
        allowInstance.loading = true
        await client().adminAllowInstance({ instance, allow: true, reason: '' })
        const res = await client().getFederatedInstances({ kind: 'allowed', limit: 1000 })
        allowedList = res.items.map((i) => i.instance)
        allowInstance.instance = ''
      }
      toast({
        content: $t('toast.updatedSite'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    } finally {
      blockInstance.loading = false
      allowInstance.loading = false
    }
  }

  async function removeInstance(instance: Instance, blocked: boolean) {
    try {
      if (blocked) {
        await client().adminBlockInstance({ instance: instance.domain, block: false, reason: '' })
        blockedList = blockedList.filter((i) => i.id !== instance.id)
      } else {
        await client().adminAllowInstance({ instance: instance.domain, allow: false, reason: '' })
        allowedList = allowedList.filter((i) => i.id !== instance.id)
      }
      toast({
        content: $t('toast.updatedSite'),
        type: 'success',
      })
    } catch (err) {
      toast({
        content: errorMessage(err as string),
        type: 'error',
      })
    }
  }

  let csv = $state<FileList | null>()

  async function parseCsv(files: FileList) {
    if (!(files.length > 0)) return

    const reader = new FileReader()

    reader.onload = async (e) => {
      const content = e.target?.result
      if (!content) return toast({ content: $t('toast.failCSV'), type: 'warning' })

      try {
        const str = content.toString()
        const lines = str.split(/\r?\n/).slice(1)
        saving = true

        for (const line of lines) {
          if (line == '') continue
          const domain = line.split(',')[0]
          try {
            await client().adminBlockInstance({ instance: domain, block: true, reason: '' })
          } catch (err) {
            console.error(`Failed to block ${domain}:`, err)
          }
        }

        const res = await client().getFederatedInstances({ kind: 'blocked', limit: 1000 })
        blockedList = res.items.map((i) => i.instance)
        toast({ content: $t('toast.updatedSite'), type: 'success' })
      } catch {
        toast({ content: $t('toast.failCSV'), type: 'error' })
      } finally {
        saving = false
      }
    }

    reader.onerror = () =>
      toast({ content: $t('toast.failCSV'), type: 'error' })

    reader.readAsText(files[0])
  }

  $effect(() => {
    if (csv) parseCsv(csv)
  })
</script>

<svelte:head>
  <title>{$t('routes.admin.federation.title')}</title>
</svelte:head>

<Header pageHeader class="font-bold text-2xl flex items-center justify-between">
  {$t('routes.admin.federation.title')}
</Header>
{#if blockedList && allowedList}
  <FileInput preview={false} bind:files={csv}>
    {#snippet button()}
      <Button class="w-max" icon={Plus}>
        {$t('routes.admin.federation.csv')}
      </Button>
    {/snippet}
    {#snippet choose()}{/snippet}
  </FileInput>
  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-1 w-full max-h-168 h-full flex flex-col gap-2">
      <h2 class="font-bold text-lg">{$t('routes.admin.federation.blocked')}</h2>
      <form
        onsubmit={preventDefault(() =>
          moderateInstance(blockInstance.instance, true),
        )}
        class="flex flex-row gap-2"
      >
        <TextInput
          placeholder={$t('routes.admin.federation.blockplaceholder')}
          class="flex-1"
          bind:value={blockInstance.instance}
        />
        <Button
          submit
          loading={blockInstance.loading}
          disabled={blockInstance.loading}
        >
          {$t('routes.admin.federation.block')}
        </Button>
      </form>
      <Material class="h-full overflow-auto" color="uniform" rounding="2xl">
        <ul
          class="*:py-3 dark:divide-zinc-800! {allowInstance.instance != ''
            ? 'opacity-50'
            : ''}"
        >
          {#if blockedList.length > 0}
            {#each blockedList.toSorted( (b, a) => b.domain.localeCompare(a.domain), ) as instance (instance.id)}
              <div
                animate:flip={{ duration: 300, easing: expoOut }}
                class="flex justify-between items-center first:pt-0 last:pb-0"
              >
                <div class="flex flex-col">
                  <span class="font-medium">{instance.domain}</span>
                  <span
                    class="text-xs text-slate-600 dark:text-zinc-400 capitalize"
                  >
                    {instance.software ?? 'Unknown'} • <RelativeDate
                      date={publishedToDate(instance.published_at)}
                    />
                  </span>
                </div>
                <Button
                  size="square-md"
                  onclick={() => removeInstance(instance, true)}
                  icon={XMark}
                ></Button>
              </div>
            {/each}
          {:else}
            <Placeholder
              icon={Check}
              title={$t('routes.admin.federation.emptyBlock.title')}
              description={$t('routes.admin.federation.emptyBlock.description')}
            />
          {/if}
        </ul>
      </Material>
    </div>
    <div class="md:flex-1 w-full max-h-168 flex flex-col gap-2">
      <h2 class="font-bold text-lg flex items-center space-x-1">
        <span>{$t('routes.admin.federation.allowed')}</span>
        {#if allowInstance.instance || !(allowedList.length == 0)}
          <Popover openOnHover placement="bottom-end">
            {#snippet target(attachment)}
              <Icon
                {@attach attachment}
                src={ExclamationTriangle}
                solid
                class="text-yellow-500"
                size="20"
              />
            {/snippet}
            <p class="font-normal">
              {$t('routes.admin.federation.emptyAllow.description')}
            </p>
          </Popover>
        {/if}
      </h2>
      <form
        onsubmit={preventDefault(() =>
          moderateInstance(allowInstance.instance, false),
        )}
        class="flex flex-row gap-2"
      >
        <TextInput
          placeholder={$t('routes.admin.federation.allowplaceholder')}
          class="flex-1"
          bind:value={allowInstance.instance}
        />
        <Button
          submit
          loading={allowInstance.loading}
          disabled={allowInstance.loading}
        >
          {$t('routes.admin.federation.allow')}
        </Button>
      </form>
      <Material class="h-full overflow-auto" color="uniform" rounding="2xl">
        <ul class="*:py-3 dark:divide-zinc-800!">
          {#if allowedList && allowedList.length > 0}
            {#each allowedList.toSorted( (b, a) => b.domain.localeCompare(a.domain), ) as instance (instance.id)}
              <div
                animate:flip={{ duration: 300, easing: expoOut }}
                class="flex justify-between items-center first:pt-0 last:pb-0"
              >
                <div class="flex flex-col">
                  <span class="font-medium">{instance.domain}</span>
                  <span
                    class="text-xs text-slate-600 dark:text-zinc-400 capitalize"
                  >
                    {instance.software ?? 'Unknown'} • <RelativeDate
                      date={publishedToDate(instance.published_at)}
                    />
                  </span>
                </div>
                <Button
                  size="square-md"
                  onclick={() => removeInstance(instance, false)}
                  icon={XMark}
                ></Button>
              </div>
            {/each}
          {:else}
            <div class="my-auto h-max">
              <Placeholder
                icon={Check}
                title={$t('routes.admin.federation.emptyAllow.title')}
                description={$t(
                  'routes.admin.federation.emptyAllow.description',
                )}
              />
            </div>
          {/if}
        </ul>
      </Material>
    </div>
  </div>
{/if}
