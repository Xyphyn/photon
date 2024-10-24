<script lang="ts">
  import { page } from '$app/stores'
  import { userSettings } from '$lib/settings'
  import { t } from '$lib/translations'
  import { searchParam } from '$lib/util.js'
  import type { SortType } from 'lemmy-js-client'
  import { Select } from 'mono-svelte'
  import {
    ArrowTrendingDown,
    ArrowTrendingUp,
    Calendar,
    CalendarDays,
    ChartBar,
    ChatBubbleLeftRight,
    ChatBubbleOvalLeft,
    Clock,
    Fire,
    Icon,
    PlusCircle,
    Scale,
    Star,
    Sun,
    Trophy,
  } from 'svelte-hero-icons'
  import { backOut } from 'svelte/easing'
  import { fly, slide } from 'svelte/transition'

  export let selected: string
  export let navigate: boolean = true
  export let changeDefault: boolean = false

  let sort: string = selected?.startsWith('Top') ? 'TopAll' : selected
  $: if (selected) {
    sort = selected?.startsWith('Top') ? 'TopAll' : selected
  }
  const setSelected = () => (selected = sort)
  $: changeDefault
    ? ($userSettings.defaultSort.sort = selected as SortType)
    : undefined

  let clazz: string = ''
  export { clazz as class }
</script>

<div class="flex flex-row {clazz}">
  <Select
    {...$$restProps}
    class={selected?.startsWith('Top') ? 'rounded-r-none' : ''}
    bind:value={sort}
    on:change={(e) => {
      setSelected()
      if (navigate) searchParam($page.url, 'sort', selected, 'page', 'cursor')
    }}
  >
    <span slot="label" class="flex items-center gap-1">
      <Icon src={ChartBar} size="13" micro />
      {$t('filter.sort.label')}
    </span>
    <option value="Active">
      <Icon
        src={ArrowTrendingUp}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.active')}
    </option>
    <option value="Hot">
      <Icon
        src={Fire}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.hot')}
    </option>
    <option value="Scaled">
      <Icon
        src={Scale}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.scaled')}
    </option>
    <option value="TopAll">
      <Icon
        src={Trophy}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.top.label')}
    </option>
    <option value="New">
      <Icon
        src={Star}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.new')}
    </option>
    <option value="Old">
      <Icon
        src={Clock}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.old')}
    </option>
    <option value="Controversial">
      <Icon
        src={ArrowTrendingDown}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.controversial')}
    </option>
    <option value="MostComments">
      <Icon
        src={ChatBubbleOvalLeft}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.mostcomments')}
    </option>
    <option value="NewComments">
      <Icon
        src={ChatBubbleLeftRight}
        size="16"
        micro
        class="text-slate-600 dark:text-zinc-400"
      />
      {$t('filter.sort.newcomments')}
    </option>
  </Select>
  {#if selected?.startsWith('Top')}
    <div transition:fly={{ easing: backOut, x: 2 }}>
      <Select
        class="border-l-0 rounded-l-none"
        bind:value={selected}
        on:change={(e) => {
          sort = 'TopAll'
          if (navigate)
            searchParam($page.url, 'sort', selected, 'page', 'cursor')
        }}
      >
        <span slot="label" class="flex items-center gap-1">
          <Icon src={Clock} size="15" micro />
          {$t('filter.sort.top.time.label')}
        </span>
        <option value="TopAll">
          <Icon
            src={PlusCircle}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />{$t('filter.sort.top.time.all')}
        </option>
        <option value="TopNineMonths">
          <Icon
            src={Calendar}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />
          {$t('filter.sort.top.time.9months')}
        </option>
        <option value="TopSixMonths">
          <Icon
            src={Calendar}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />
          {$t('filter.sort.top.time.6months')}
        </option>
        <option value="TopThreeMonths">
          <Icon
            src={Calendar}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />
          {$t('filter.sort.top.time.3months')}
        </option>
        <option value="TopMonth">
          <Icon
            src={CalendarDays}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />{$t('filter.sort.top.time.month')}
        </option>
        <option value="TopWeek">
          <Icon
            src={CalendarDays}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />{$t('filter.sort.top.time.week')}
        </option>
        <option value="TopDay">
          <Icon
            src={Sun}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />{$t('filter.sort.top.time.day')}
        </option>
        <option value="TopTwelveHour">
          <Icon
            src={Clock}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />{$t('filter.sort.top.time.12hours')}
        </option>
        <option value="TopSixHour">
          <Icon
            src={Clock}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />{$t('filter.sort.top.time.6hours')}
        </option>
        <option value="TopHour">
          <Icon
            src={Clock}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />{$t('filter.sort.top.time.hour')}
        </option>
      </Select>
    </div>
  {/if}
</div>
