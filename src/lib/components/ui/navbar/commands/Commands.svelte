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
    Fire,
    GlobeAlt,
    Home,
    Icon,
    Identification,
    Inbox,
    MagnifyingGlass,
    Newspaper,
    PencilSquare,
    QuestionMarkCircle,
    ShieldCheck,
    UserCircle,
    UserGroup,
    type IconSource,
  } from 'svelte-hero-icons'
  import Avatar from '../../Avatar.svelte'
  import { t } from '$lib/translations'
  import CommandItem from './CommandItem.svelte'
  import { browser } from '$app/environment'
  import { afterNavigate, goto } from '$app/navigation'
  import { profile } from '$lib/auth'
  import { fullCommunityName } from '$lib/util'

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
      name: $t('nav.commands.main'),
      actions: [
        { href: '/', name: $t('nav.home'), icon: Home, shortcut: 'h' },
        { href: '/communities', name: $t('nav.communities'), icon: GlobeAlt },
      ],
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
          shortcut: 'i',
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
    {
      name: $t('profile.subscribed'),
      actions:
        $profile?.user?.follows.map((f) => ({
          icon: f.community.icon,
          name: f.community.title,
          href: `/c/${fullCommunityName(f.community.name, f.community.actor_id)}`,
        })) ?? [],
    },
  ]

  let search = ''
  let container: HTMLElement
  const dispatch = createEventDispatcher()
  let selectedIndex = 0

  function fuzzySearch(text: string, pattern: string): number {
    const textLower = text.toLowerCase()
    const patternLower = pattern.toLowerCase()
    let score = 0
    let lastIndex = -1
    let consecutiveBonus = 0

    for (let i = 0; i < patternLower.length; i++) {
      const index = textLower.indexOf(patternLower[i], lastIndex + 1)
      if (index === -1) return 0

      score += 1
      if (index === lastIndex + 1) {
        consecutiveBonus++
        score += consecutiveBonus
      } else {
        consecutiveBonus = 0
      }

      lastIndex = index
    }

    // Bonus for matching start of words
    if (textLower.startsWith(patternLower)) {
      score += 2
    } else if (textLower.includes(' ' + patternLower)) {
      score += 1
    }

    return score
  }

  $: filteredGroups = groups
    .map((group) => {
      const scoredActions = group.actions
        .map((action) => ({
          ...action,
          score: Math.max(fuzzySearch(action.name, search)),
        }))
        .filter((action) => action.score > 0)
        .sort((a, b) => b.score - a.score)

      return {
        ...group,
        actions: scoredActions,
        score: Math.max(
          fuzzySearch(group.name, search),
          ...scoredActions.map((a) => a.score),
        ),
      }
    })
    .filter((group) => group.actions.length > 0)
    .sort((a, b) => b.score - a.score)

  $: flattenedActions = filteredGroups.flatMap((group) => group.actions)

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

    if (event.ctrlKey) {
      const actions = groups
        .flatMap((g) => g.actions)
        .filter((a) => a.shortcut != undefined)

      actions.forEach((a) => {
        if (event.key === a.shortcut) {
          event.preventDefault()
          if (a.href) goto(a.href)
          if (a.handle) a.handle()
        }
      })
    }

    if (!open) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        selectedIndex = (selectedIndex + 1) % flattenedActions.length
        focusItem(selectedIndex)
        break
      case 'ArrowUp':
        event.preventDefault()
        selectedIndex =
          (selectedIndex - 1 + flattenedActions.length) %
          flattenedActions.length
        focusItem(selectedIndex)
        break
      case 'Enter':
        handleSelect(flattenedActions[selectedIndex])
        break
      case 'Escape':
        event.preventDefault()
        togglePalette()
        break
    }

    if (selectedIndex >= flattenedActions.length) selectedIndex = 0
  }

  function focusItem(index: number) {
    if (!browser) return

    const listItems = container?.querySelectorAll('li')
    listItems[index % listItems.length].focus()
    listItems[index % listItems.length].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  async function handleSelect(action: Action) {
    if (!action) return
    if (action.href) goto(action.href)
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
                    ? '!bg-slate-100 dark:!bg-zinc-800 text-inherit'
                    : 'text-slate-600 dark:text-zinc-400'} block"
                />
              </li>
            {/each}
          </ul>
        </div>
      {/each}
      {#if search != ''}
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
      {/if}
    </div>
  </div>
</Modal>
