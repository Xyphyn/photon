<script lang="ts">
  import { PostBody } from '$lib/feature/post'
  import { Material } from 'mono-svelte'
  import type { ClassValue } from 'svelte/elements'
  import LabelStat from '../info/LabelStat.svelte'
  import TextProps from '../text/TextProps.svelte'
  import Avatar from './Avatar.svelte'
  import Blobs from './Blobs.svelte'

  interface Props {
    avatar?: string
    name: string
    bio?: string
    banner?: string | null
    url?: string
    stats?: {
      name: string
      value: string | number
      format?: boolean
    }[]
    class?: ClassValue
    nameDetail?: import('svelte').Snippet
    actions?: import('svelte').Snippet
    children?: import('svelte').Snippet
    compact?: 'always' | 'lg' | 'never'
    avatarCircle?: boolean
  }

  let {
    avatar,
    name,
    bio,
    banner,
    url,
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

<div {...rest} class={['z-10 text-sm w-full space-y-4 @container', clazz]}>
  <Material padding="xl" rounding="3xl" class="flex flex-col gap-2 @lg:gap-4">
    {#if banner !== null}
      <div
        class="relative overflow-hidden rounded-t-[inherit] -m-6 mask-b-from-0 h-32 @lg:h-48"
      >
        {#if banner}
          <img
            src={banner}
            class="w-full object-cover h-full bg-white dark:bg-zinc-900"
            height="192"
            alt="User banner"
          />
        {:else}
          <div class="scale-150 h-full">
            <Blobs seed={name} />
          </div>
        {/if}
      </div>
    {/if}

    {#snippet pfp(width: number)}
      <Avatar
        {width}
        url={avatar}
        alt={name}
        circle={avatarCircle}
        class={[
          'relative',
          banner !== null && '-mt-4 @md:-mt-8',
          !avatarCircle && 'rounded-xl @md:rounded-3xl!',
        ]}
      />
    {/snippet}

    <div class="contents @md:hidden">
      {@render pfp(48)}
    </div>

    <div class="hidden @md:contents">
      {@render pfp(72)}
    </div>

    <div class="space-y-1">
      <svelte:element
        this={url ? 'a' : 'h1'}
        href={url}
        class={[
          'text-xl @md:text-2xl font-medium tracking-tight',
          url &&
            'hover:underline hover:text-primary-900 dark:hover:text-primary-100',
        ]}
      >
        {name}
      </svelte:element>
      {#if nameDetail}
        <p
          class="flex items-center gap-0 text-sm text-slate-600 dark:text-zinc-400 max-w-full w-max"
        >
          <TextProps wrap="no-wrap">
            {@render nameDetail?.()}
          </TextProps>
        </p>
      {/if}
    </div>
  </Material>
  {#if actions || stats.length > 0}
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
