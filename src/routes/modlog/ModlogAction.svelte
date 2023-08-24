<script lang="ts">
  import type { IconSource } from 'svelte-hero-icons'
  import {
    Icon,
    QuestionMarkCircle,
    Trash,
    UserMinus,
    UserPlus,
    XCircle,
  } from 'svelte-hero-icons'
  import type { ActionName } from './+page.js'

  export let action: ActionName

  $: actionData = getAction(action)

  const getAction = (
    action: ActionName
  ): { icon: IconSource; text: string; class: string } => {
    switch (action) {
      case 'ban': {
        return {
          icon: XCircle,
          class: 'text-red-600 dark:text-red-400',
          text: 'Ban',
        }
      }
      case 'commentRemoval': {
        return {
          icon: Trash,
          class: 'text-red-600 dark:text-red-400',
          text: 'Removal',
        }
      }
      case 'postRemoval': {
        return {
          icon: Trash,
          class: 'text-red-600 dark:text-red-400',
          text: 'Removal',
        }
      }
      case 'modAdd': {
        return {
          icon: UserPlus,
          class: 'text-green-600 dark:text-green-400',
          text: 'Added Mod',
        }
      }
      case 'modRemove': {
        return {
          icon: UserMinus,
          class: 'text-red-600 dark:text-red-400',
          text: 'Removed Mod',
        }
      }
    }

    return {
      icon: QuestionMarkCircle,
      text: 'Unknown',
      class: '',
    }
  }
</script>

<span class="font-bold">
  <span class="flex items-center gap-1 {actionData.class}">
    <Icon src={actionData.icon} size="16" mini class="inline flex-shrink-0" />
    {actionData.text}
  </span>
</span>
