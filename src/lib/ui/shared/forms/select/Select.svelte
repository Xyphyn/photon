<script lang="ts" module>
  import { Label, Menu, MenuButton } from 'mono-svelte'
  import { buttonSize } from 'mono-svelte/button/Button.svelte'
  import { type Snippet, setContext, tick } from 'svelte'
  import type { Placement } from 'svelte-floating-ui/dom'
  import {
    CheckCircle,
    ChevronUpDown,
    Icon,
    type IconSource,
  } from 'svelte-hero-icons/dist'
  import type { Attachment } from 'svelte/attachments'
  import type { ClassValue, HTMLSelectAttributes } from 'svelte/elements'

  interface Props<T> extends Omit<HTMLSelectAttributes, 'size'> {
    value?: T | string | undefined
    placeholder?: string | undefined
    label?: string | undefined
    size?: 'md' | 'sm'
    id?: string
    class?: ClassValue
    baseClass?: ClassValue
    selectClass?: ClassValue
    customLabel?: import('svelte').Snippet
    children?: import('svelte').Snippet
    customOption?: import('svelte').Snippet<
      [
        {
          option: {
            value: string
            label: string
            icon?: IconSource
            disabled?: boolean
          }
          selected: boolean
        },
      ]
    >
    target?: Snippet<[Attachment]>
    oncontextmenu?: HTMLSelectAttributes['oncontextmenu']
    onchange?: HTMLSelectAttributes['onchange']
    placement?: Placement
  }

  export type { Props as SelectProps }
</script>

<script lang="ts" generics="T">
  let open = $state(false)
  let element: HTMLSelectElement | undefined = $state()

  interface SelectContext {
    options: {
      value: string
      label: string
      icon?: IconSource
      disabled?: boolean
      isLabel?: boolean
    }[]
  }

  const context = setContext<SelectContext>('select', {
    options: [],
  })

  let {
    value = $bindable(undefined),
    placeholder = undefined,
    label = undefined,
    size = 'md',
    class: clazz = '',
    baseClass = '',
    selectClass = '',
    customLabel,
    children,
    customOption,
    oncontextmenu,
    onchange,
    placement = 'bottom',
    target: passedTarget,
    ...rest
  }: Props<T> = $props()
</script>

{#snippet selectTarget(attachment: Attachment)}
  <Label
    text={label}
    customText={customLabel}
    class={['space-y-1 relative max-w-full w-max min-w-0', baseClass]}
  >
    <div class="relative max-w-full" role="presentation">
      <select
        {@attach attachment}
        {...rest}
        bind:this={element}
        class={[
          buttonSize[size],
          'btn btn-secondary select rounded-xl appearance-none pr-6! w-full',
          selectClass,
          clazz,
        ]}
        bind:value
        onmousedown={(e) => {
          e.preventDefault()
        }}
        onkeypress={(e) => {
          e.preventDefault()
          open = !open
        }}
        {onchange}
        {oncontextmenu}
        {placeholder}
      >
        {#if placeholder}
          <option disabled selected value="">{placeholder}</option>
        {/if}
        {@render children?.()}
      </select>
      <Icon
        src={ChevronUpDown}
        micro
        size="16"
        class="absolute bottom-1/2 translate-y-1/2 right-1 box-border pointer-events-none z-10 text-slate-600 dark:text-zinc-400"
      />
    </div>
  </Label>
{/snippet}

<Menu bind:open {placement}>
  {#snippet target(attachment)}
    {@const render = passedTarget ?? selectTarget}
    {@render render?.(attachment)}
  {/snippet}
  {#each context.options as option (option)}
    {#if customOption}{@render customOption({
        option,
        selected: option.value == value,
      })}{:else}
      <MenuButton
        onclick={async () => {
          value = option.value
          await tick()
          element?.dispatchEvent(new Event('change', { bubbles: true }))
        }}
        size="custom"
        disabled={option.disabled}
        color="none"
        class={[
          'min-h-0! py-1 hover:bg-slate-100 dark:hover:bg-zinc-800',
          option.value == value &&
            'bg-slate-100 dark:bg-zinc-800 text-primary-900 dark:text-primary-100 font-medium',
          option.disabled &&
            'pointer-events-none text-slate-600 dark:text-zinc-400',
          option.isLabel && 'text-xs mt-2',
        ]}
      >
        {#if option.value == value}
          <Icon
            src={CheckCircle}
            size="16"
            micro
            class="text-primary-900 dark:text-primary-100"
          />
        {:else if option.icon}
          <Icon
            src={option.icon}
            size="16"
            micro
            class="text-slate-600 dark:text-zinc-400"
          />
        {/if}
        {@html option.label}
      </MenuButton>
    {/if}
  {/each}
</Menu>
