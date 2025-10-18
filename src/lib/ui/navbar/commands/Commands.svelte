<script lang="ts">
  import { browser } from '$app/environment'
  import { goto } from '$app/navigation'
  import { page } from '$app/state'
  import { profile } from '$lib/app/auth.svelte'
  import { t } from '$lib/app/i18n'
  import { theme } from '$lib/app/theme/theme.svelte'
  import { fuzzySearch } from '$lib/app/util.svelte'
  import { resumables } from '$lib/feature/legacy/item'
  import { CommonList } from '$lib/ui/layout'
  import EndPlaceholder from '$lib/ui/layout/EndPlaceholder.svelte'
  import { TextInput } from 'mono-svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import { Home, Icon } from 'svelte-hero-icons/dist'
  import {
    type Action,
    type Group,
    dynamicActions,
    getGroups,
  } from './actions.svelte'
  import CommandItem from './CommandItem.svelte'

  interface Props {
    open?: boolean
    groups?: Group[]
  }

  let { open = $bindable(false), groups = $bindable([]) }: Props = $props()

  $effect(() => {
    groups = getGroups(
      $resumables,
      profile.current,
      profile.meta.profiles,
      theme.data,
      page.data.contextual?.actions,
    )
  })

  let search = $state('')
  let container: HTMLElement | undefined = $state()
  const dispatch = createEventDispatcher()
  let selectedIndex = $state(0)
  let filteredGroups: Group[] = $state([])
  let breadcrumbs: Action[] = $state([])
  let input = $state<HTMLInputElement>()

  const debounce = (fn: Function, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
  }

  function searchGroup(term: string) {
    if (term.length < 1) {
      if (breadcrumbs.length <= 0) {
        filteredGroups = groups.map((group) => ({
          ...group,
          actions: flattenActions(group.actions, false),
        }))
      }
    } else {
      filteredGroups = [
        ...groups
          .map((group) => {
            const scoredActions = flattenActions(group.actions)
              .map((action) => ({
                ...action,
                score: Math.max(
                  fuzzySearch(action.name, term),
                  fuzzySearch(group.name, term),
                  action.detail ? fuzzySearch(action.detail, term) : -1,
                ),
              }))
              .filter((action) => action.score > 0)
              .sort((a, b) => b.score - a.score)

            return {
              ...group,
              actions: scoredActions,
              score: Math.max(
                fuzzySearch(group.name, term),
                ...scoredActions.map((a) => a.score),
              ),
            }
          })
          .filter((group) => group.actions.length > 0)
          .sort((a, b) => b.score - a.score),
        dynamicActions(term),
      ]
    }
  }

  const debouncedSearch = debounce((term: string) => searchGroup(term), 50)

  function updateFilteredGroups() {
    if (breadcrumbs.length === 0) {
      filteredGroups = groups
    } else {
      const lastAction = breadcrumbs[breadcrumbs.length - 1]
      filteredGroups = [
        {
          name: lastAction.name,
          actions: lastAction.subActions || [],
        },
      ]
    }
    selectedIndex = 0
    search = ''
  }

  function goBack() {
    breadcrumbs.pop()
    updateFilteredGroups()
  }

  function flattenActions(
    actions: Action[],
    subaction: boolean = true,
  ): Action[] {
    return actions.flatMap((action) => [
      action,
      ...(action.subActions && subaction
        ? flattenActions(action.subActions)
        : []),
    ])
  }

  function togglePalette() {
    open = !open
    if (open) {
      search = ''
      selectedIndex = 0
      filteredGroups = groups
      breadcrumbs = []
    }
  }

  function handleKeydown(event: KeyboardEvent) {
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
        searchGroup(search)
        handleSelect(flattenedActions[selectedIndex])
        break
      case 'Escape':
        event.preventDefault()
        if (breadcrumbs.length > 0) {
          breadcrumbs.pop()
          updateFilteredGroups()
        } else {
          togglePalette()
        }
        break
    }

    if (selectedIndex >= flattenedActions.length) selectedIndex = 0
  }

  function focusItem(index: number) {
    if (!browser) return

    const listItems = container?.querySelectorAll('li')
    if (!listItems) return
    listItems[index % listItems.length].focus()
    listItems[index % listItems.length].scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  async function handleSelect(action: Action) {
    if (!action) return
    if (action.subActions && action.subActions.length > 0) {
      breadcrumbs = [...breadcrumbs, action]
      updateFilteredGroups()
    } else {
      if (action.href) goto(action.href)
      if (action.handle) action.handle()
      togglePalette()
      dispatch('select', action)
    }
  }

  $effect(() => {
    if (open) search = ''
  })

  $effect(() => {
    debouncedSearch(search)
  })

  onMount(() => {
    if (input) input.focus()
  })

  let flattenedActions = $derived(
    filteredGroups.flatMap((group) => group.actions),
  )
</script>

<svelte:window onkeydown={handleKeydown} />

<TextInput
  bind:value={search}
  class="sticky rounded-none! border-t-0 border-x-0 focus-within:border-inherit! focus-within:ring-0!"
  size="lg"
  placeholder={$t('nav.commands.prompt')}
  bind:element={input}
/>
<div class="h-128 overflow-auto border-slate-200 dark:border-zinc-800 p-5">
  {#if breadcrumbs.length > 0}
    <div class="flex items-center gap-2 my-1">
      <button
        class="text-[13px] font-medium text-slate-600 dark:text-zinc-400"
        onclick={goBack}
      >
        <Icon src={Home} size="16" mini />
      </button>
      {#each breadcrumbs as crumb}
        <span class="text-base text-slate-400 dark:text-zinc-600">/</span>
        <span class="text-[13px] font-medium">
          {crumb.name}
        </span>
      {/each}
    </div>
  {/if}
  <div class="space-y-1" bind:this={container}>
    {#each filteredGroups as group, groupIndex}
      <div class="space-y-1">
        <EndPlaceholder margin="md" size="sm">{group.name}</EndPlaceholder>
        <CommonList size="xs" class="p-0! sm:p-0! lg:p-0!">
          {#each group.actions as action, actionIndex}
            {@const globalIndex =
              filteredGroups
                .slice(0, groupIndex)
                .reduce((sum, g) => sum + g.actions.length, 0) + actionIndex}
            <li
              class={[
                'custom-size',
                globalIndex == selectedIndex &&
                  'brightness-95 dark:brightness-125',
              ]}
            >
              <CommandItem
                {action}
                onclick={(e) => {
                  if (action.href) {
                    togglePalette()
                    return
                  }
                  e.stopPropagation()
                  handleSelect(action)
                }}
              />
            </li>
          {/each}
        </CommonList>
      </div>
    {/each}
  </div>
</div>
