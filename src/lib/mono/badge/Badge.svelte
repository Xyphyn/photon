<script lang="ts">
  const badgeColor = {
    'red-subtle': `bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400
		ring-red-400 dark:ring-red-500/30`,
    'green-subtle': `bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400
		ring-green-400 dark:ring-green-500/30`,
    'yellow-subtle': `bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400
		ring-yellow-400 dark:ring-yellow-500/30`,
    'gray-subtle': `bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300
		ring-gray-400 dark:ring-gray-400/30`,
    'blue-subtle': `bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300
		ring-blue-400 dark:ring-blue-400/30`,
    'purple-subtle': `bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400
		ring-purple-400 dark:ring-purple-500/30`,
    custom: '',
  }

  const badgeRoundness = {
    full: 'rounded-full',
    md: 'rounded-md',
    custom: '',
  }

  type BadgeColor = keyof typeof badgeColor
  type BadgeRoundness = keyof typeof badgeRoundness

  interface Props {
    label?: string
    color?: BadgeColor
    rounding?: BadgeRoundness
    allowIconOnly?: boolean
    class?: string
    icon?: import('svelte').Snippet
    children?: import('svelte').Snippet
  }

  let {
    label = '',
    color = 'gray-subtle',
    rounding = 'full',
    allowIconOnly = false,
    class: clazz = '',
    icon,
    children,
    ...rest
  }: Props = $props()
</script>

<span
  {...rest}
  class={[
    badgeRoundness[rounding],
    badgeColor[color],
    'px-2.5 py-1 text-xs font-medium flex items-center gap-1 ring-1 ring-inset',
    allowIconOnly && 'max-md:px-1.5 max-md:py-1.5',
    clazz,
  ]}
  title={label}
>
  {@render icon?.()}
  <span class={allowIconOnly ? 'hidden md:contents' : 'contents'}>
    {@render children?.()}
  </span>
</span>
