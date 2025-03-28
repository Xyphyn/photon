<script lang="ts" module>
  import { env } from '$env/dynamic/public'

  import type { IconSource } from 'svelte-hero-icons'

  function parseBadge() {
    try {
      if (env.PUBLIC_BADGES) {
        return JSON.parse(env.PUBLIC_BADGES)
      } else {
        return {}
      }
    } catch (e) {
      return {}
    }
  }

  const badges = parseBadge()

  const getEnvBadge = (
    actor_id: string,
  ):
    | {
        classes: string
        icon: 'photon' | IconSource
        iconClass?: string
      }
    | false => {
    if (badges.photon && badges.photon?.includes?.(actor_id)) {
      return {
        classes:
          'bg-gradient-to-r bg-clip-text text-transparent from-blue-500 to-purple-700 dark:from-blue-400 dark:to-purple-500',
        icon: 'photon',
      }
    }

    if (badges.translator && badges.translator?.includes?.(actor_id)) {
      return {
        classes:
          'bg-gradient-to-r bg-clip-text text-transparent from-sky-500 to-blue-700 dark:from-blue-300 dark:to-indigo-500',
        icon: Language,
        iconClass: 'text-blue-500 dark:text-blue-400',
      }
    }

    return false
  }
</script>

<script lang="ts">
  import Avatar from '$lib/components/ui/Avatar.svelte'
  import Logo from '$lib/components/ui/Logo.svelte'
  import { settings } from '$lib/settings.svelte.js'
  import type { Person } from 'lemmy-js-client'
  import { Icon, Language, NoSymbol } from 'svelte-hero-icons'

  interface Props {
    user: Person
    avatar?: boolean
    avatarSize?: number
    badges?: boolean
    inComment?: boolean
    showInstance?: boolean
    displayName?: any
    instanceClass?: string
    class?: string
    children?: import('svelte').Snippet
    extraBadges?: import('svelte').Snippet
  }

  let {
    user,
    avatar = false,
    avatarSize = 24,
    badges = true,
    inComment = false,
    showInstance = settings.showInstances.user ||
      (settings.showInstances.comments && inComment),
    displayName = settings.displayNames,
    instanceClass = '',
    class: clazz = '',
    children,
    extraBadges,
  }: Props = $props()

  let envBadge = $derived(getEnvBadge(user.actor_id))
  let verified = $derived(
    [...user.name].reduce((a, c) => a + c.charCodeAt(0), 0) % 2 === 0,
  )
</script>

<a
  class="items-center flex flex-row gap-1 hover:underline max-w-full min-w-0 {clazz}"
  href="/u/{user.name}@{new URL(user.actor_id).hostname}"
  data-sveltekit-preload-data="tap"
>
  {@render children?.()}
  {#if avatar}
    <Avatar
      url={user.avatar}
      alt={user.name}
      width={avatarSize}
      class="flex-shrink-0"
    />
  {/if}
  <span
    class="flex gap-0 items-center flex-shrink max-w-full min-w-0"
    class:ml-0.5={avatar}
  >
    <span
      class:font-medium={showInstance}
      class="username-text {envBadge && envBadge.classes}"
    >
      {displayName ? user.display_name || user.name : user.name}
    </span>
    {#if showInstance}
      <span
        class="text-slate-500 dark:text-zinc-500 font-normal instance-text flex-shrink {instanceClass ??
          ''}"
      >
        @{new URL(user.actor_id).hostname}
      </span>
    {/if}
  </span>
  {#if badges}
    {#if user.banned}
      <div class="text-red-500" title="Banned">
        <Icon src={NoSymbol} mini size="12" />
      </div>
    {/if}
    {#if user.bot_account}
      <div class="text-blue-500 font-bold" title="Bot">BOT</div>
    {/if}
    {#if envBadge}
      {#if envBadge.icon == 'photon'}
        <Logo width={16} />
      {:else}
        <Icon
          src={envBadge.icon}
          micro
          size="16"
          class={envBadge.iconClass ?? envBadge.classes}
        />
      {/if}
    {/if}
    {#if verified}
      <svg width={16} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
          fill="#1d9bf0"
        />
      </svg>{/if}
    {@render extraBadges?.()}
  {/if}
</a>

<style>
  .instance-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
    max-width: 100%;
    flex: 1;
  }

  .username-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
