<script context="module" lang="ts">
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
  import { Badge, Material, Spinner, toast } from 'mono-svelte'
  import { DEFAULT_INSTANCE_URL } from '$lib/instance.js'
  import { validateInstance } from '$lib/lemmy.js'
  import { Button, TextInput } from 'mono-svelte'
  import { onMount } from 'svelte'
  import Avatar from '$lib/components/ui/Avatar.svelte'

  let selectedInstance: string = ''
  let validating: boolean = false
  let placeholder = DEFAULT_INSTANCE_URL

  let instances: Instance[] | undefined = undefined

  onMount(async () => {
    try {
      const res: Instance[] = (
        await fetch(`https://data.lemmyverse.net/data/instance.full.json`).then(
          (r) => r.json()
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

      // instances = [
      //   {
      //     banner: '',
      //     baseurl: 'fart.net',
      //     desc: 'a instance',
      //     downvotes: false,
      //     fed: true,
      //     icon: '',
      //     langs: [''],
      //     name: 'fart',
      //     tags: ['okay'],
      //   },
      // ]
    } catch (e) {
      toast({
        content: 'Failed to fetch available instances.',
        type: 'error',
      })
    }
  })

  let heights: number[] = []

  const addHeight = (node: HTMLButtonElement, index: number) => {
    heights.splice(index, 0, node.clientHeight)
  }
</script>

<svelte:head>
  <title>Sign up | Choose Instance</title>
</svelte:head>

<div class="mx-auto max-w-xl flex flex-col gap-4 my-auto h-max w-full">
  <h1 class="font-bold text-4xl">Sign Up</h1>
  <p>Choose an instance that interests you, or type the URL manually.</p>
  <p>
    An instance is the server that your account will be hosted on, but you can
    still access and interact with content from other instances.
  </p>
  <Material color="distinct" class="h-64 overflow-auto">
    <div
      class="flex flex-col h-full divide-y divide-slate-200 dark:divide-zinc-800"
    >
      {#if instances}
        {#each instances as instance}
          <button
            on:click={() => (selectedInstance = instance.baseurl ?? '')}
            class="flex flex-row gap-2 text-left py-2 first:pt-0 last:pb-0 items-center"
          >
            <Avatar
              width={32}
              url={instance.icon}
              alt={instance.name}
              class="flex-shrink-0"
            />
            <div class="flex flex-col">
              <span class="font-medium text-base">
                {instance.name}
              </span>
              <span>{instance.desc}</span>
            </div>
          </button>
        {/each}
      {:else}
        <div class="mx-auto my-auto self-center justify-self-center">
          <Spinner width={32} />
        </div>
      {/if}
    </div>
  </Material>
  <form
    class="flex flex-col gap-4"
    on:submit|preventDefault={async () => {
      if (selectedInstance != '') {
        validating = true

        if (await validateInstance(selectedInstance.trim())) {
          goto(`/signup/${selectedInstance}`)
        } else {
          toast({
            content: 'Could not contact that instance URL',
            type: 'error',
          })
        }

        validating = false
      }
    }}
  >
    <TextInput
      bind:value={selectedInstance}
      label="Choose an instance"
      required
      {placeholder}
      on:input={() => {
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
      Go
    </Button>
  </form>
</div>
