<script lang="ts">
  import { resumables } from '$lib/lemmy/item'
  import {
    Button,
    buttonColor,
    buttonSize,
    Modal,
    TextInput,
  } from 'mono-svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import {
    Icon,
    PencilSquare,
    QuestionMarkCircle,
    type IconSource,
  } from 'svelte-hero-icons'
  import Avatar from '../../Avatar.svelte'

  let open = true
  $: if (open) search = ''

  onMount(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key == '/') {
        e.preventDefault()
        open = !open
      }
    })
  })

  interface Group {
    name: string
    actions: Action[]
  }

  interface Action {
    name: string
    desc?: string
    handle?: () => any
    href?: string
    shortcut?: string
    icon: string | IconSource
  }

  export let groups: Group[] = []

  $: groups = [
    {
      name: 'Recents',
      actions: $resumables.map((r) => ({
        name: r.name,
        icon: r.avatar ?? PencilSquare,
        href: r.url,
      })),
    },
  ]

  let search = ''
  const dispatch = createEventDispatcher()
  let selectedIndex = 0

  $: flattenedActions = groups.flatMap((group) =>
    group.actions.map((action) => ({ ...action, group: group.name })),
  )

  $: filteredActions = flattenedActions.filter(
    (action) =>
      action.name.toLowerCase().includes(search.toLowerCase()) ||
      action.group.toLowerCase().includes(search.toLowerCase()),
  )

  function togglePalette() {
    open = !open
    if (open) {
      search = ''
      selectedIndex = 0
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault()
      togglePalette()
    }

    if (!open) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = (selectedIndex + 1) % filteredActions.length
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex =
          (selectedIndex - 1 + filteredActions.length) % filteredActions.length
        break
      case 'Enter':
        event.preventDefault()
        if (filteredActions[selectedIndex]) {
          dispatch('select', filteredActions[selectedIndex])
          togglePalette()
        }
        break
      case 'Escape':
        event.preventDefault()
        togglePalette()
        break
    }
  }

  function handleSelect(action: Action & { group: string }) {
    dispatch('select', action)
    togglePalette()
  }
</script>

<Modal title="Command Prompt" bind:open>
  <TextInput bind:value={search} autofocus />
  {#if search == ''}
    {#each groups as group}
      <div class="space-y-1">
        <span class="text-slate-700 dark:text-zinc-300 font-medium text-sm">
          {group.name}
        </span>
        <ul class="flex flex-col">
          {#each group.actions as action}
            <Button
              href={action.href}
              on:click={action.handle}
              alignment="left"
              color="tertiary"
              size="lg"
            >
              {#if typeof action.icon === 'string'}
                <Avatar url={action.icon} width={24} />
              {:else}
                <Icon src={action.icon ?? QuestionMarkCircle} size="24" mini />
              {/if}
              {action.name}
            </Button>
          {/each}
        </ul>
      </div>
    {/each}
  {:else}
    {#each filteredActions as action}
      <Button
        href={action.href}
        on:click={action.handle}
        alignment="left"
        color="tertiary"
        size="lg"
      >
        {#if typeof action.icon === 'string'}
          <Avatar url={action.icon} width={24} />
        {:else}
          <Icon src={action.icon ?? QuestionMarkCircle} size="24" mini />
        {/if}
        {action.name}
      </Button>
    {/each}
  {/if}
</Modal>
