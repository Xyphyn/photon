<script lang="ts">
  import { t } from '$lib/app/i18n'
  import Markdown from '$lib/app/markdown/Markdown.svelte'
  import { Expandable } from 'mono-svelte'
  import type { ClassValue } from 'svelte/elements'
  import FormattedNumber from '../util/FormattedNumber.svelte'
  import Avatar from './Avatar.svelte'

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
    center?: boolean
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
    center = false,
    class: clazz = '',
    nameDetail,
    actions,
    children,
    compact,
    avatarCircle = true,
    ...rest
  }: Props = $props()
</script>

<div {...rest} class={['z-10 text-sm contents w-full', clazz]}>
  <div
    class={[
      compact == 'lg' && 'lg:hidden',
      compact == 'always' && 'hidden',
      'absolute inset-0 h-96 overflow-x-hidden -z-10',
    ]}
  >
    <img
      src={banner || avatar}
      class="w-full h-64 object-cover blur-3xl opacity-30 dark:opacity-30"
      height="192"
      alt="User banner"
    />
  </div>
  {#if banner}
    <div class="relative overflow-hidden rounded-xl">
      <img
        src={banner}
        class="w-full object-cover h-48 rounded-t-xl bg-white dark:bg-zinc-900 rounded-xl"
        height="192"
        alt="User banner"
      />
    </div>
  {/if}

  <Avatar
    width={96}
    url={avatar}
    alt={name}
    circle={avatarCircle}
    class={[
      'ring-slate-25 bg-slate-25 dark:bg-zinc-925 ring-6 relative dark:ring-zinc-950',
      banner && '-mt-12 ml-4',
      !avatarCircle && 'rounded-3xl!',
    ]}
  />
  <div class="py-4 flex flex-col gap-4">
    <div class="flex flex-col flex-1">
      <svelte:element
        this={url ? 'a' : 'span'}
        href={url}
        class="text-2xl font-medium tracking-tight {url
          ? 'hover:underline hover:text-primary-900 dark:hover:text-primary-100'
          : ''}"
      >
        {name}
      </svelte:element>
      <span
        class="flex items-center gap-0 text-sm text-slate-600 dark:text-zinc-400 max-w-full w-max"
      >
        {@render nameDetail?.()}
      </span>

      {#if actions}
        <div class="flex flex-col mt-2">
          {@render actions?.()}
        </div>
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
          <div class="">
            <div class="text-slate-600 dark:text-zinc-500 text-sm font-medium">
              {stat.name}
            </div>
            <div
              class="text-xl font-medium text-primary-900 dark:text-primary-100 text-right"
            >
              {#if stat.format ?? true}
                <FormattedNumber
                  number={Number(stat.value)}
                  options={{ notation: 'standard' }}
                />
              {:else}
                {stat.value}
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
  {#if bio}
    <div
      class={[
        compact == 'lg' && 'lg:hidden',
        compact == 'always' && 'hidden',
        'relative w-full mb-4 text-base',
        center ? 'text-center' : 'text-left',
      ]}
    >
      {#if bio.length > 300}
        <Expandable>
          {#snippet title()}
            {$t('cards.site.about')}
          {/snippet}
          <Markdown source={bio} class="font-normal" />
        </Expandable>
      {:else}
        <Markdown source={bio} class="font-normal" />
      {/if}
    </div>
  {/if}
  <div class="space-y-3 py-4 pt-0">
    {@render children?.()}
  </div>
</div>

<style>
  .banner-mask {
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  }
</style>
