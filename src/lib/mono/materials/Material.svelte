<script lang="ts">
	type Elevation = keyof typeof elevationClass
	type Padding = keyof typeof paddingClass
	type Rounding = keyof typeof roundedClass
	type Color = keyof typeof colorClass

	const elevationClass = {
		flat: '',
		low: 'shadow-xs',
		medium: 'shadow-sm',
		high: 'shadow-md',
		xhigh: 'shadow-lg',
		max: 'shadow-xl'
	}

	const paddingClass = {
		none: 'p-0',
		sm: 'p-2',
		md: 'p-4',
		lg: 'p-5',
		xl: 'p-6'
	}

	const roundedClass = {
		none: 'rounded-none',
		sm: 'rounded-sm',
		md: 'rounded-md',
		lg: 'rounded-lg',
		xl: 'rounded-xl',
		'2xl': 'rounded-2xl',
		full: 'rounded-full'
	}

	const colorClass = {
		default:
			'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700',
		distinct:
			'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 border-b-slate-300 dark:border-t-zinc-700',
		transparent:
			'border border-slate-200 dark:border-zinc-900 border-b-slate-300 dark:border-t-zinc-800',
		none: ''
	}

	export let elevation: Elevation = 'flat'
	export let padding: Padding = 'md'
	export let rounding: Rounding = 'lg'
	export let color: Color = 'default'

	export let element: string = 'div'
</script>

<svelte:element
	this={element}
	on:click
	on:keypress
	on:keydown
	on:keyup
	on:focus
	{...$$restProps}
	class="{elevationClass[elevation]}
  {paddingClass[padding]}
  {roundedClass[rounding]}
  {colorClass[color]}
   text-sm
  {$$props.class}
  "
>
	<slot />
</svelte:element>
