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
    ArrowRightOnRectangle,
    Bookmark,
    Cog6Tooth,
    Icon,
    Identification,
    Inbox,
    MagnifyingGlass,
    Newspaper,
    PencilSquare,
    QuestionMarkCircle,
    UserCircle,
    UserGroup,
    type IconSource,
  } from 'svelte-hero-icons'
  import Avatar from '../../Avatar.svelte'
  import { t } from '$lib/translations'
  import CommandItem from './CommandItem.svelte'
  import { browser } from '$app/environment'
  import { afterNavigate, goto } from '$app/navigation'

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
      name: $t('nav.commands.recents'),
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
        {
          href: '/accounts',
          name: $t('account.accounts'),
          icon: UserGroup,
        },
        {
          href: '/login',
          name: $t('account.login'),
          icon: ArrowRightOnRectangle,
        },
        {
          href: '/signup',
          name: $t('account.signup'),
          icon: Identification,
        },
      ],
    },
    {
      name: $t('nav.menu.app'),
      actions: [
        {
          href: '/settings',
          name: $t('nav.menu.settings'),
          icon: Cog6Tooth,
        },
      ],
    },
    {
      name: $t('nav.commands.content'),
      actions: [
        {
          href: '/create/post',
          name: $t('routes.createPost'),
          icon: PencilSquare,
        },
        {
          href: '/create/community',
          name: $t('routes.createCommunity'),
          icon: Newspaper,
        },
      ],
    },
  ]

  let search = ''
  let container: HTMLElement
  const dispatch = createEventDispatcher()
  let selectedIndex = 0

  $: filteredGroups = groups
    .map((group) => ({
      ...group,
      actions: group.actions.filter((action) =>
        action.name.toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((group) => group.actions.length > 0)

  $: flattenedActions = groups.flatMap((group) =>
    group.actions.map((action) => ({ ...action, group: group.name })),
  )

  $: filteredActions = flattenedActions.filter((action) =>
    action.name.toLowerCase().includes(search.toLowerCase()),
  )

  function togglePalette() {
    open = !open
    if (open) {
      search = ''
      selectedIndex = 0
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if ((event.ctrlKey && event.key === 'k') || event.key == '/') {
      event.preventDefault()
      togglePalette()
    }

    if (!open) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = (selectedIndex + 1) % filteredActions.length
        focusItem(selectedIndex)
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex =
          (selectedIndex - 1 + filteredActions.length) % filteredActions.length
        focusItem(selectedIndex)
        break
      case 'Enter':
        handleSelect(filteredActions[selectedIndex])
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
    togglePalette()
    dispatch('select', action)
  }

  afterNavigate(() => {
    open = false
  })
</script>

<svelte:window on:keydown={handleKeydown} />

<Modal title={$t('nav.commands.prompt')} bind:open>
  <TextInput bind:value={search} autofocus class="sticky" />
  <div
    class="h-96 overflow-auto border-t border-slate-200 dark:border-zinc-800"
  >
    <div class="space-y-1" bind:this={container}>
      {#each filteredGroups as group, groupIndex}
        <div class="space-y-1">
          <span class="text-sm font-medium">{group.name}</span>
          <ul class="flex flex-col gap-1">
            {#each group.actions as action, actionIndex}
              {@const globalIndex =
                filteredGroups
                  .slice(0, groupIndex)
                  .reduce((sum, g) => sum + g.actions.length, 0) + actionIndex}
              <li>
                <CommandItem
                  {action}
                  class="{globalIndex == selectedIndex
                    ? 'bg-slate-200 dark:bg-zinc-800 text-inherit'
                    : 'text-slate-600 dark:text-zinc-400'} block"
                />
              </li>
            {/each}
          </ul>
        </div>
      {/each}
      <CommandItem
        action={{
          name: search,
          href: `/search?q=${encodeURIComponent(search)}`,
          icon: MagnifyingGlass,
        }}
      >
        <span class="font-normal text-slate-600 dark:text-zinc-400">
          {$t('nav.commands.search', { default: '' })}
        </span>
      </CommandItem>
    </div>
  </div>
</Modal>
