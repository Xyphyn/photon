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
    } catch {
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
          'bg-linear-to-r bg-clip-text text-transparent from-pink-500 to-fuchsia-500 dark:from-pink-400 dark:to-purple-400',
        icon: 'photon',
      }
    }

    if (badges.translator && badges.translator?.includes?.(actor_id)) {
      return {
        classes:
          'bg-linear-to-r bg-clip-text text-transparent from-sky-500 to-blue-700 dark:from-blue-300 dark:to-indigo-500',
        icon: Language,
        iconClass: 'text-blue-500 dark:text-blue-400',
      }
    }

    return false
  }
</script>

<script lang="ts">
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import Logo from '$lib/ui/generic/Logo.svelte'
  import { settings } from '$lib/settings.svelte.js'
  import type { Person } from '$lib/api/types'
  import { Icon, Language, NoSymbol } from 'svelte-hero-icons'
  import { Badge } from 'mono-svelte'

  interface Props {
    user: Person
    avatar?: boolean
    avatarSize?: number
    badges?: boolean
    inComment?: boolean
    showInstance?: boolean
    displayName?: boolean
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
</script>

<a
  class="items-center inline-flex flex-row gap-1 hover:underline max-w-full min-w-0 {clazz}"
  href="/u/{user.name}@{new URL(user.actor_id).hostname}"
  data-sveltekit-preload-data="tap"
>
  {@render children?.()}
  {#if avatar}
    <Avatar
      url={user.avatar}
      alt={user.name}
      width={avatarSize}
      class="shrink-0"
    />
  {/if}
  <span
    class="flex gap-0 items-center shrink max-w-full min-w-0"
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
        class="text-slate-500 dark:text-zinc-500 font-normal instance-text shrink {instanceClass ??
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
    {#if user.flair}
      <Badge color="blue-subtle" class="px-1.5! py-0.5! whitespace-nowrap">
        {user.flair}
      </Badge>
    {/if}
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
