<script lang="ts">
  import type { Post, PostEvent } from '$lib/api/types'
  import { locale, t } from '$lib/app/i18n'
  import Blobs from '$lib/ui/generic/Blobs.svelte'
  import { publishedToDate } from '$lib/ui/util/date'
  import RelativeDate from '$lib/ui/util/RelativeDate.svelte'
  import { Material } from 'mono-svelte'
  import {
    Calendar,
    Clock,
    CurrencyDollar,
    Icon,
    MapPin,
  } from 'svelte-hero-icons/dist'

  interface Props {
    post: Post & { event: PostEvent }
  }

  let { post }: Props = $props()
</script>

<div class="grid grid-cols-2 gap-4">
  <Material
    rounding="2xl"
    color="info"
    class="relative z-0 flex flex-col overflow-hidden col-span-2"
  >
    <div class="-m-4 mask-b-from-0 scale-125 -z-10">
      <Blobs seed={post.name} />
    </div>
    <h3 class="font-display text-3xl tracking-tight">
      {post.name}
    </h3>
  </Material>
  {#if post.event.start}
    {@const startDate = publishedToDate(post.event.start)}
    <Material rounding="2xl" color="info" class="space-y-1">
      <Icon src={Calendar} size="20" mini />
      <h4 class="capitalize text-xl font-display">
        <date>
          {startDate.toLocaleDateString($locale, {
            dateStyle: 'long',
          })}
        </date>
      </h4>
      <RelativeDate options={{ style: 'long' }} date={startDate} />
    </Material>
    <Material rounding="2xl" color="info" class="space-y-1">
      <Icon src={Clock} size="20" mini />
      <h4 class="capitalize text-xl font-display">
        <time>
          {startDate.toLocaleTimeString($locale, {
            timeStyle: 'long',
          })}
        </time>
      </h4>
      <time>
        {startDate.toLocaleTimeString($locale, {
          timeZone: 'GMT',
          timeStyle: 'long',
        })}
      </time>
    </Material>
  {/if}
  {#if post.event.event_fee_amount}
    <Material rounding="2xl" color="info" class="space-y-1">
      <Icon src={CurrencyDollar} size="20" mini />
      <h5 class="capitalize text-lg font-display">
        {post.event.event_fee_amount}
        {post.event.event_fee_currency ?? ''}
      </h5>
    </Material>
  {/if}
  {#if post.event.location && Object.keys(post.event.location).length > 0}
    <Material rounding="2xl" color="info" class="space-y-1">
      <Icon src={MapPin} size="20" mini />
      <h4 class="capitalize text-xl font-display">
        {$t('filter.location.label')}
      </h4>
      <dl class="space-y-2">
        {#each Object.keys(post.event.location) as key}
          <div class="flex flex-row justify-between flex-wrap">
            <dt class="capitalize font-medium">{key}</dt>
            <dd>{post.event.location[key]}</dd>
          </div>
        {/each}
      </dl>
    </Material>
  {/if}
</div>
