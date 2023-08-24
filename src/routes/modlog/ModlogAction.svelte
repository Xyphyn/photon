<script lang="ts">
  import type { IconSource } from 'svelte-hero-icons'
  import {
    Icon,
    InformationCircle,
    LockClosed,
    LockOpen,
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
      case 'postFeature': {
        return {
          icon: InformationCircle,
          class: 'text-green-600 dark:text-green-400',
          text: 'Featured Post',
        }
      }
      case 'postUnfeature': {
        return {
          icon: InformationCircle,
          class: 'text-red-600 dark:text-red-400',
          text: 'Unfeatured Post',
        }
      }
      case 'postLock': {
        return {
          icon: LockClosed,
          class: 'text-yellow-600 dark:text-yellow-400',
          text: 'Locked Post',
        }
      }
      case 'postUnlock': {
        return {
          icon: LockOpen,
          class: 'text-yellow-600 dark:text-yellow-400',
          text: 'Unlocked Post',
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
