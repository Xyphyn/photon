<script lang="ts">
  import type { Modlog } from '$lib/api/types'
  import { Badge } from 'mono-svelte'
  import {
    CheckCircle,
    Fire,
    Icon,
    type IconSource,
    LockClosed,
    LockOpen,
    Megaphone,
    QuestionMarkCircle,
    Trash,
    UserMinus,
    UserPlus,
    XCircle,
  } from 'svelte-hero-icons/dist'

  interface Props {
    action: Modlog
  }

  let { action }: Props = $props()

  const getAction = (
    action: Modlog,
  ): {
    icon: IconSource
    text: string
    class: 'red-subtle' | 'green-subtle' | 'yellow-subtle' | 'gray-subtle'
  } => {
    switch (action.kind) {
      case 'admin_ban': {
        return action.is_revert
          ? {
              icon: CheckCircle,
              class: 'green-subtle',
              text: 'Unban (instance)',
            }
          : {
              icon: XCircle,
              class: 'red-subtle',
              text: 'Ban (instance)',
            }
      }
      case 'mod_ban_from_community': {
        return action.is_revert
          ? {
              icon: CheckCircle,
              class: 'green-subtle',
              text: 'Unban (Community)',
            }
          : {
              icon: XCircle,
              class: 'red-subtle',
              text: 'Ban (community)',
            }
      }
      case 'mod_remove_comment': {
        return action.is_revert
          ? {
              icon: Trash,
              class: 'green-subtle',
              text: 'Restoration',
            }
          : {
              icon: Trash,
              class: 'red-subtle',
              text: 'Removal',
            }
      }
      case 'mod_remove_post': {
        return action.is_revert
          ? {
              icon: Trash,
              class: 'green-subtle',
              text: 'Restoration',
            }
          : {
              icon: Trash,
              class: 'red-subtle',
              text: 'Removal',
            }
      }
      case 'mod_add_to_community': {
        return action.is_revert
          ? {
              icon: UserMinus,
              class: 'red-subtle',
              text: 'Removed Mod',
            }
          : {
              icon: UserPlus,
              class: 'green-subtle',
              text: 'Added Mod',
            }
      }
      case 'mod_feature_post_community': {
        return action.is_revert
          ? {
              icon: Megaphone,
              class: 'red-subtle',
              text: 'Unfeatured Post',
            }
          : {
              icon: Megaphone,
              class: 'green-subtle',
              text: 'Featured Post',
            }
      }
      case 'mod_lock_post': {
        return action.is_revert
          ? {
              icon: LockOpen,
              class: 'yellow-subtle',
              text: 'Unlocked Post',
            }
          : {
              icon: LockClosed,
              class: 'yellow-subtle',
              text: 'Locked Post',
            }
      }
      case 'admin_purge_post':
      case 'admin_purge_comment':
      case 'admin_purge_community':
      case 'admin_purge_person': {
        return {
          icon: Fire,
          class: 'red-subtle',
          text: 'Purge',
        }
      }
      case 'admin_add': {
        return action.is_revert
          ? {
              icon: UserMinus,
              class: 'red-subtle',
              text: 'Removed Admin',
            }
          : {
              icon: UserPlus,
              class: 'green-subtle',
              text: 'Added Admin',
            }
      }
    }

    return {
      icon: QuestionMarkCircle,
      text: 'Unknown',
      class: 'gray-subtle',
    }
  }
  let actionData = $derived(getAction(action))
</script>

<Badge color={actionData.class} class="text-sm! px-3 w-max">
  {#snippet icon()}
    <Icon src={actionData.icon} size="16" micro class="inline shrink-0" />
  {/snippet}
  {actionData.text}
</Badge>
