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
    Bookmark,
    Icon,
    Inbox,
    PencilSquare,
    QuestionMarkCircle,
    UserCircle,
    type IconSource,
  } from 'svelte-hero-icons'
  import Avatar from '../../Avatar.svelte'
  import { t } from '$lib/translations'
  import CommandItem from './CommandItem.svelte'
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'

  export let open = false
  $: if (open) search = ''

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
    {
      name: $t('profile.profile'),
      actions: [
        {
          href: '/profile/user',
          name: $t('profile.profile'),
          icon: UserCircle,
        },
        {
          href: '/inbox',
          name: $t('profile.inbox'),
          icon: Inbox,
        },
        {
          href: '/saved',
          name: $t('profile.saved'),
          icon: Bookmark,
        },
      ],
    },
  ]

  let search = ''
  let container: HTMLElement
  const dispatch = createEventDispatcher()
  let selectedIndex = 0

  $: flattenedActions = groups.flatMap((group) =>
    group.actions.map((action) => ({ ...action, group: group.name })),
  )

  $: filteredActions = flattenedActions.filter((action) =>
    action.name.toLowerCase().includes(search.toLowerCase()),
  )

  function togglePalette() {
    open = false
    if (open) {
      search = ''
      selectedIndex = 0
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey && event.key === 'k') || event.key == '/') {
      event.preventDefault()
      open = true
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
          handleSelect(filteredActions[selectedIndex])
          dispatch('select', filteredActions[selectedIndex])
        }
        break
      case 'Escape':
        event.preventDefault()
        togglePalette()
        break
    }
  }

  function focusItem(index: number) {
    if (!browser) return

    const listItems = container?.querySelectorAll('li')
    listItems[index % listItems.length].focus()
  }

  async function handleSelect(action: Action & { group: string }) {
    if (action.href) await goto(action.href)
    if (action.handle) action.handle()
    dispatch('select', action)
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal title="Command Prompt" bind:open>
  <TextInput bind:value={search} autofocus />
  <div class="space-y-1" bind:this={container}>
    {#if search == ''}
      {#each groups as group}
        <span class="text-slate-700 dark:text-zinc-300 font-medium text-sm">
          {group.name}
        </span>
        <ul class="flex flex-col gap-1">
          {#each group.actions as action, index}
            <CommandItem {action} />
          {/each}
        </ul>
      {/each}
    {:else}
      <ul class="flex flex-col gap-1">
        {#each filteredActions as action, index}
          <CommandItem {action} />
        {/each}
      </ul>
    {/if}
  </div>
</Modal>
