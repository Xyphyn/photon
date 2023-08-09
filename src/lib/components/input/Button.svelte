<script lang="ts">
  import Spinner from '$lib/components/ui/loader/Spinner.svelte'

  type ButtonColor = keyof typeof buttonColor
  type ButtonSize = keyof typeof buttonSize
  type ButtonRoundness = keyof typeof buttonRoundness
  type ButtonAlignment = keyof typeof buttonAlignment

  const buttonAlignment = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  }

  const buttonColor = {
    primary: `border border-slate-900 bg-slate-900 dark:bg-zinc-100
    dark:border-zinc-100 dark:text-black hover:text-inherit hover:dark:text-inherit text-slate-100
    hover:bg-transparent hover:dark:bg-transparent
    active:bg-black/10 active:dark:bg-white/10`,

    secondary:
      'border border-slate-200 dark:border-zinc-700 bg-transparent hover:bg-slate-100 hover:dark:bg-zinc-800 dark:text-zinc-400',

    tertiary:
      'border border-transparent bg-transparent hover:bg-slate-100 hover:dark:bg-zinc-800 dark:text-zinc-200',

    danger:
      'border border-red-500 bg-red-500 hover:text-red-500 hover:bg-transparent text-white',

    ghost: `border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 hover:dark:bg-zinc-800
      hover:border-slate-200 hover:dark:border-zinc-700`,

    elevated: `bg-slate-100 dark:bg-zinc-800 border border-slate-200
     dark:border-zinc-700 hover:bg-slate-200 hover:dark:bg-zinc-700 hover:border-slate-300
     hover:dark:border-zinc-600`,

    elevatedLow: `bg-slate-100 dark:bg-zinc-900 border border-slate-200
    dark:border-zinc-800 hover:bg-slate-200 hover:dark:bg-zinc-800 hover:border-slate-300
    hover:dark:border-zinc-700`,

    none: '',
  }

  const buttonSize = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
    'square-sm': 'w-6 h-6',
    'square-md': 'w-8 h-8',
    'square-lg': 'w-10 h-10',
  }

  const buttonRoundness = {
    pill: 'rounded-full',
    md: 'rounded-md',
    none: '',
  }

  export let loading = false
  export let submit = false

  export let color: ButtonColor = 'secondary'
  export let size: ButtonSize = 'md'
  export let rounded: ButtonRoundness = 'md'
  export let alignment: ButtonAlignment = 'center'

  // const dispatch = createEventDispatcher()
  export let href: string | undefined = undefined
</script>

{#if href}
  <a
    {href}
    on:click
    {...$$restProps}
    class="
      {buttonColor[color]}
      {buttonSize[size]}
      {buttonRoundness[rounded]}
      text-sm transition-colors disabled:!opacity-70 disabled:!pointer-events-none
      disabled:!border disabled:!border-slate-300 disabled:!bg-slate-200 disabled:dark:!border-zinc-700 disabled:dark:!bg-zinc-800
      {$$props.class}
     {loading
      ? color == 'primary'
        ? '!bg-transparent !text-inherit'
        : ''
      : ''}"
  >
    <div
      class="flex flex-row items-center gap-1.5 h-full {buttonAlignment[
        alignment
      ]}"
    >
      {#if loading}
        <Spinner
          width={size == 'lg' ? 20 : size == 'md' ? 18 : size == 'sm' ? 16 : 16}
        />
      {:else}
        <slot name="icon" />
      {/if}
      <slot />
    </div>
  </a>
{:else}
  <button
    {...$$restProps}
    on:click
    class="
      {buttonColor[color]}
      {buttonSize[size]}
      {buttonRoundness[rounded]}
      text-sm transition-colors disabled:!opacity-70 disabled:!pointer-events-none
      disabled:!border disabled:!border-slate-300 disabled:!bg-slate-200
      disabled:dark:!border-zinc-700 disabled:dark:!bg-zinc-800 disabled:text-inherit
      {$$props.class}
     {loading
      ? color == 'primary'
        ? '!bg-transparent !text-inherit'
        : ''
      : ''}"
    type={submit ? 'submit' : 'button'}
  >
    <div
      class="flex flex-row items-center gap-1.5 {buttonAlignment[alignment]}"
    >
      {#if loading}
        <Spinner
          width={size == 'lg' ? 20 : size == 'md' ? 18 : size == 'sm' ? 16 : 16}
        />
      {:else}
        <slot name="icon" />
      {/if}
      <slot />
    </div>
  </button>
{/if}
