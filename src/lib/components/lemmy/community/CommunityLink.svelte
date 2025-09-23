<script lang="ts">
  import type { Community } from '$lib/client/types'
  import Avatar from '$comp/ui/Avatar.svelte'
  import { t } from '$lib/i18n/translations'
  import { settings } from '$lib/settings.svelte.js'
  import { communityLink } from '$lib/util.svelte'
  import { ExclamationTriangle, Icon } from 'svelte-hero-icons'
  import type { HTMLAnchorAttributes } from 'svelte/elements'

  interface Props extends HTMLAnchorAttributes {
    community: Community
    avatar?: boolean
    name?: boolean
    avatarSize?: number
    showInstance?: boolean
    displayName?: boolean
    badges?: {
      nsfw: boolean
    }
    class?: string
    instanceClass?: string
  }

  let {
    community,
    avatar = false,
    name = true,
    avatarSize = 24,
    showInstance = settings.showInstances.community,
    displayName = true,
    badges = {
      nsfw: false,
    },
    class: clazz = '',
    instanceClass = '',
    ...rest
  }: Props = $props()
</script>

<a
  {...rest}
  class={[
    'items-center inline-flex flex-row gap-2 hover:underline max-w-full min-w-0',
    clazz,
  ]}
  href={communityLink(community)}
  data-sveltekit-preload-data="tap"
>
  {#if avatar && !badges.nsfw}
    <Avatar url={community.icon} alt={community.name} width={avatarSize} />
  {/if}

  {#if name}
    <span class="flex gap-0 items-center max-w-full min-w-0 shrink">
      <span class="font-medium username-text">
        {displayName ? community.title : community.name}
      </span>
      {#if showInstance}
        <span
          class="text-slate-500 dark:text-zinc-500 font-normal
          instance-text shrink {instanceClass || ''}"
        >
          @{new URL(community.actor_id).hostname}
        </span>
      {/if}
    </span>
  {/if}
  {#if badges}
    {#if badges.nsfw}
      <Icon
        src={ExclamationTriangle}
        size="14"
        micro
        title={$t('post.badges.nsfw')}
        class="text-red-600 dark:text-red-400"
      />
    {/if}
  {/if}
</a>

<style>
  .instance-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    flex: 1;
  }

  .username-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
