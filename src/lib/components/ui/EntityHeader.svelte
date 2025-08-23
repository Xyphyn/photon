<script lang="ts">
  import { t } from '$lib/i18n/translations'
  import type { ClassValue } from 'svelte/elements'
  import Markdown from '../markdown/Markdown.svelte'
  import FormattedNumber from '../util/FormattedNumber.svelte'
  import Avatar from './Avatar.svelte'
  import Expandable from './Expandable.svelte'

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
    ...rest
  }: Props = $props()
</script>

<div {...rest} class={['z-10 text-sm contents w-full', clazz]}>
  <div class="absolute inset-0 h-96 overflow-x-hidden -z-10">
    <img
      src={banner || avatar}
      class="w-full h-48 blur-3xl"
      height="192"
      alt="User banner"
    />
  </div>
  {#if banner || avatar}
    <div class="relative overflow-hidden rounded-xl">
      <img
        src={banner || avatar}
        class="w-full object-cover h-48 rounded-t-xl bg-white dark:bg-zinc-900 rounded-xl"
        class:blur-xl={!banner}
        height="192"
        alt="User banner"
      />
    </div>
  {/if}

  <Avatar
    width={96}
    url={avatar}
    alt={name}
    class="ring-slate-25 bg-slate-25 dark:bg-zinc-925 -mt-12 ml-4 ring-6 relative dark:ring-zinc-950"
  />
  <div class="py-4 flex flex-col xl:flex-row gap-4">
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
      <div class="text-sm flex flex-row flex-wrap overflow-hidden gap-4 h-full">
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
