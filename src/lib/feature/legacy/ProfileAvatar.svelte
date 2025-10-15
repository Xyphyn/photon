<script lang="ts">
  import { type ProfileInfo } from '$lib/app/auth.svelte.js'
  import Avatar from '$lib/ui/generic/Avatar.svelte'

  interface Props {
    profile?: ProfileInfo | undefined
    selected?: boolean
    size?: number
  }

  let { profile = undefined, selected = false, size = 22 }: Props = $props()
</script>

{#if profile}
  <div
    style="width: {size}px; height: {size}px;"
    class={[profile.avatar && 'bg-slate-200 rounded-full dark:bg-zinc-700']}
  >
    <Avatar
      url={profile.avatar}
      alt={profile.username}
      width={size}
      class={[
        'shrink-0 rounded-full',
        selected && 'scale-75',
        'transition-transform',
      ]}
    />
  </div>
{/if}
