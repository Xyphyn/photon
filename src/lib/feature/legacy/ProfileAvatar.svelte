<script lang="ts">
  import { type ProfileInfo } from '$lib/app/auth.svelte.js'
  import Avatar from '$lib/ui/generic/Avatar.svelte'
  import { Icon, UserCircle } from 'svelte-hero-icons/dist'

  interface Props {
    profile?: ProfileInfo | undefined
    selected?: boolean
    index?: number
    size?: number
    guest?: boolean
  }

  let {
    profile = undefined,
    selected = false,
    index = 0,
    size = 22,
    guest = false,
  }: Props = $props()
</script>

{#if profile}
  <div
    style="width: {size}px; height: {size}px;"
    class={[profile.avatar && 'bg-slate-200 rounded-full dark:bg-zinc-700']}
  >
    {#if profile.avatar}
      <Avatar
        url={profile.avatar}
        width={size}
        alt=""
        class={[
          'shrink-0 rounded-full',
          selected && 'scale-75',
          'transition-transform',
        ]}
      />
    {:else}
      <Icon
        src={UserCircle}
        mini={selected}
        size={size?.toString()}
        title={profile.username}
        class="text-blue-500 shrink-0"
        style={guest
          ? `color: gray`
          : profile.color
            ? `color: ${profile.color}`
            : `filter: hue-rotate(${index * 50}deg)`}
      />
    {/if}
  </div>
{/if}
