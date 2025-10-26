<script lang="ts">
  import { PostBody } from '$lib/feature/post'
  import { Material } from 'mono-svelte'
  import type { ClassValue } from 'svelte/elements'
  import LabelStat from '../info/LabelStat.svelte'
  import Avatar from './Avatar.svelte'
  import Blobs from './Blobs.svelte'

  interface Props {
    avatar?: string | undefined
    name: string
    bio?: string | undefined
    banner?: string | undefined
    url?: string | undefined
    stats?: {
      name: string
      value: string
      format?: boolean
    }[]
    class?: ClassValue
    nameDetail?: import('svelte').Snippet
    actions?: import('svelte').Snippet
    children?: import('svelte').Snippet
    compact?: 'always' | 'lg'
    avatarCircle?: boolean
  }

  let {
    avatar = undefined,
    name,
    bio = undefined,
    banner = undefined,
    url = undefined,
    stats = [],
    class: clazz = '',
    nameDetail,
    actions,
    children,
    compact,
    avatarCircle = true,
    ...rest
  }: Props = $props()
</script>

<div {...rest} class={['z-10 text-sm contents w-full space-y-4', clazz]}>
  <Material padding="xl" rounding="3xl" class="flex flex-col gap-4">
    <div
      class="relative overflow-hidden rounded-t-[inherit] -m-6 mask-b-from-0"
    >
      {#if banner}
        <img
          src={banner}
          class="w-full object-cover h-48 bg-white dark:bg-zinc-900"
          height="192"
          alt="User banner"
        />
      {:else}
        <div class="scale-150">
          <Blobs seed={name} />
        </div>
      {/if}
    </div>

    <Avatar
      width={72}
      url={avatar}
      alt={name}
      circle={avatarCircle}
      class={[
        'ring-slate-25 bg-slate-25 dark:bg-zinc-925 ring-6 relative dark:ring-zinc-950',
        '-mt-8',
        !avatarCircle && 'rounded-3xl!',
      ]}
    />

    <div class="space-y-1">
      <svelte:element
        this={url ? 'a' : 'h1'}
        href={url}
        class="text-2xl font-medium tracking-tight {url
          ? 'hover:underline hover:text-primary-900 dark:hover:text-primary-100'
          : ''}"
      >
        {name}
      </svelte:element>
      <p
        class="flex items-center gap-0 text-sm text-slate-600 dark:text-zinc-400 max-w-full w-max"
      >
        {@render nameDetail?.()}
      </p>
    </div>
  </Material>
  {#if actions || stats}
    <div class="space-y-4">
      <div class="flex flex-col flex-1">
        {#if actions}
          {@render actions?.()}
        {/if}
      </div>
      {#if stats.length > 0}
        <div
          class={[
            compact == 'lg' && 'lg:hidden',
            compact == 'always' ? 'hidden' : 'flex',
            'text-sm flex-row flex-wrap overflow-hidden gap-4 h-full',
          ]}
        >
          {#each stats as stat}
            <LabelStat
              label={stat.name}
              content={stat.value}
              labelClass="text-sm"
              contentClass="text-lg"
            />
          {/each}
        </div>
      {/if}
    </div>
  {/if}
  {#if bio}
    <PostBody
      body={bio}
      class={[
        compact == 'lg' && 'lg:hidden',
        compact == 'always' && 'hidden',
        'relative',
      ]}
      clickThrough={false}
    />
  {/if}
  {#if children}
    <div class="space-y-3 py-4 pt-0 mt-4">
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  .banner-mask {
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }
</style>
