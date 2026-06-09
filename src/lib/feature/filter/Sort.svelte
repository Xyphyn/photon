<script lang="ts" generics="T extends PostSortType | CommunitySortType">
  import { page } from '$app/state'
  import type { CommunitySortType, PostSortType } from '$lib/api/types'
  import { t } from '$lib/app/i18n'
  import { searchParam } from '$lib/app/util.svelte'
  import { Button, Option, Select } from 'mono-svelte'
  import { type SelectProps } from 'mono-svelte/forms/select/Select.svelte'
  import {
    ArrowDown,
    ArrowTrendingDown,
    ArrowTrendingUp,
    ArrowUp,
    Calendar,
    CalendarDays,
    ChartBar,
    ChatBubbleLeftRight,
    ChatBubbleOvalLeft,
    Clock,
    Fire,
    Icon,
    PencilSquare,
    PlusCircle,
    Scale,
    Star,
    Sun,
    Trophy,
    UserGroup,
    type IconVariants,
  } from 'svelte-hero-icons/dist'
  import { type Attachment } from 'svelte/attachments'

  interface Props extends Omit<SelectProps<string>, 'onchange'> {
    selected: T
    type?: 'post' | 'community'
    period?: number
    navigate?: boolean
    changeDefault?: boolean
    class?: string
    onchange?: (i: { sort: T; period?: number }) => void
  }

  let { navigate = false, type = 'post', onchange, class: clazz = '', ...rest }: Props = $props()

  let sort = $derived(rest.selected)
  let period = $derived(rest.period ?? 0)

  const options: {
    post: {
      value: PostSortType
      icon: IconVariants
      name: string
    }[]
    community: {
      value: CommunitySortType
      icon: IconVariants
      name: string
    }[]
  } = {
    post: [
      {
        value: 'active',
        icon: ArrowTrendingUp,
        name: $t('filter.sort.active'),
      },
      {
        value: 'hot',
        icon: Fire,
        name: $t('filter.sort.hot'),
      },
      {
        value: 'scaled',
        icon: Scale,
        name: $t('filter.sort.scaled'),
      },
      {
        value: 'top',
        icon: Trophy,
        name: $t('filter.sort.top'),
      },
      {
        value: 'new',
        icon: Star,
        name: $t('filter.sort.new'),
      },
      {
        value: 'old',
        icon: Clock,
        name: $t('filter.sort.old'),
      },
      {
        value: 'controversial',
        icon: ArrowTrendingDown,
        name: $t('filter.sort.controversial'),
      },
      {
        value: 'most_comments',
        icon: ChatBubbleOvalLeft,
        name: $t('filter.sort.mostcomments'),
      },
      {
        value: 'new_comments',
        icon: ChatBubbleLeftRight,
        name: $t('filter.sort.newcomments'),
      },
    ],
    community: [
      {
        value: 'active_daily',
        icon: ArrowTrendingUp,
        name: $t('filter.sort.active'),
      },
      {
        value: 'hot',
        icon: Fire,
        name: $t('filter.sort.hot'),
      },
      {
        value: 'active_six_months',
        icon: Trophy,
        name: $t('filter.sort.top.label'),
      },
      {
        value: 'new',
        icon: Star,
        name: $t('filter.sort.new'),
      },
      {
        value: 'posts',
        icon: PencilSquare,
        name: $t('filter.sort.posts'),
      },
      {
        value: 'old',
        icon: Clock,
        name: $t('filter.sort.old'),
      },
      {
        value: 'subscribers',
        icon: UserGroup,
        name: $t('filter.sort.subscribers'),
      },
      {
        value: 'comments',
        icon: ChatBubbleOvalLeft,
        name: $t('filter.sort.mostcomments'),
      },
      {
        value: 'name_asc',
        icon: ArrowUp,
        name: $t('filter.sort.nameAsc'),
      },
      {
        value: 'name_desc',
        icon: ArrowDown,
        name: $t('filter.sort.nameDes'),
      },
    ],
  }
</script>

<div class="flex flex-row {clazz}">
  <Select
    {...rest}
    class="rounded-r-none"
    bind:value={sort}
    onchange={(v) => {
      if (navigate) searchParam(page.url, 'sort', v!, 'page', 'cursor')
      onchange?.({ sort: sort as T, period })
    }}
  >
    {#snippet customLabel()}
      <span class="flex items-center gap-1">
        <Icon src={ChartBar} size="13" micro />
        {$t('filter.sort.label')}
      </span>
    {/snippet}
    {#each options[type] as option}
      <Option value={option.value} icon={option.icon}>
        {option.name}
      </Option>
    {/each}
  </Select>
  {#snippet periodLabel()}
    <span class="flex items-center gap-1">
      <Icon src={Clock} size="15" micro />
      {$t('filter.sort.top.time.label')}
    </span>
  {/snippet}

  {#snippet periodTarget(attachment: Attachment)}
    <Button
      {@attach attachment}
      size="custom"
      class="rounded-l-none h-8.5 mt-auto border-l-0! aspect-square"
      icon={Clock}
      title={$t('filter.sort.top.time.label')}
    />
    <div class="hidden">
      {@render periodOptions()}
    </div>
  {/snippet}
  {#snippet periodOptions()}
    <Option value="0" icon={PlusCircle}>
      {$t('filter.sort.top.time.all')}
    </Option>
    <Option value="31536000" icon={Calendar}>
      {$t('filter.sort.top.time.year')}
    </Option>
    <Option value="23328000" icon={Calendar}>
      {$t('filter.sort.top.time.9months')}
    </Option>
    <Option value="15552000" icon={Calendar}>
      {$t('filter.sort.top.time.6months')}
    </Option>
    <Option value="7776000" icon={Calendar}>
      {$t('filter.sort.top.time.3months')}
    </Option>
    <Option value="2592000" icon={CalendarDays}>
      {$t('filter.sort.top.time.month')}
    </Option>
    <Option value="604800" icon={CalendarDays}>
      {$t('filter.sort.top.time.week')}
    </Option>
    <Option value="86400" icon={Sun}>
      {$t('filter.sort.top.time.day')}
    </Option>
    <Option value="43200" icon={Clock}>
      {$t('filter.sort.top.time.12hours')}
    </Option>
    <Option value="21600" icon={Clock}>
      {$t('filter.sort.top.time.6hours')}
    </Option>
    <Option value="3600" icon={Clock}>
      {$t('filter.sort.top.time.hour')}
    </Option>
  {/snippet}
  <Select
    class="border-l-0 rounded-l-none"
    bind:value={() => period?.toString(), (v) => (period = Number(v))}
    onchange={(v) => {
      if (navigate) searchParam(page.url, 'period', v!.toString(), 'page', 'cursor')
      onchange?.({ sort: sort as T, period })
    }}
    customLabel={period != 0 ? periodLabel : undefined}
    target={period != 0 ? undefined : periodTarget}
  >
    {@render periodOptions()}
  </Select>
</div>
